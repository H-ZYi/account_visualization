
// 獲取 CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

let jm; // 定義全局變數

// 1. 載入心智圖數據
window.onload = function() {

    const logoutForm = document.getElementById("logout-form");
    if (logoutForm) {
        logoutForm.submit();
    } else {
        console.error("找不到 'logout-form' 元素");
    }

    /*
    const minddata = {
        "meta": { "name": "example", "author": "jsMind" },
        "format": "node_tree",
        "data": {
            "id": "root", "topic": "帳號管理", "children": [
                { "id": "sub1", "topic": "遊戲帳號" },
                { "id": "sub2", "topic": "金融帳號" },
                { "id": "sub3", "topic": "社交帳號" }
            ]
        }
    };
    */

    const options = {
        container: 'jsmind_container', // 容器的ID
        editable: true,              // 是否启用编辑
        theme: 'greensea',           // 主题
        mode :'full',                // 布局模式
        support_html : false,         // 是否支持节点里的HTML元素
        log_level: 'disable',        // 日志级别
        view: {
            engine: 'canvas',           // 思维导图各节点之间线条的绘制引擎
            hmargin:100,             // 思维导图距容器外框的最小水平距离
            vmargin:50,              // 思维导图距容器外框的最小垂直距离
            line_width:2,            // 思维导图线条的粗细
            line_color:'#555',       // 思维导图线条的颜色
            line_style: 'curved',    // 思维导图线条的样式，直线(straight)或者曲线(curved)
            custom_line_render: null,// 自定义的线条渲染方法
            draggable: true,         // 当容器不能完全容纳思维导图时，是否允许拖动画布代替鼠标滚动
            hide_scorllbars_when_draggable: false, // 当设置 draggable = true 时，是否隐藏滚动条 */
            node_overflow: 'wrap',   // 节点文本过长时的样式,展開(wrap)或隱藏部分文本(hidden)
            zoom: {                  // 配置缩放
                min: 0.5,            // 最小的缩放比例
                max: 2.0,            // 最大的缩放比例
                step: 0.1 },         // 缩放比例间隔
            custom_node_render: null,// 自定义的节点渲染方法
            expander_style: 'char',  // 子節點展開控制器樣式
        },
        layout: {
            hspace:30,               // 节点之间的水平间距
            vspace:20,               // 节点之间的垂直间距
            pspace:13,               // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
            cousin_space:0           // 相邻节点的子节点之间的额外的垂直间距
        },
        shortcut: {
            enable: true,            // 是否启用快捷键
            handles:{                // 命名的快捷键事件处理器

            },
            mapping: {              // 快捷键映射
                addchild:   65,     // <A>
                addbrother: 66,     // <B>
                editnode:   69,     // <E>
                delnode:    46,     // <Delete>
                toggle:     32,     // <Space>
                left:       37,     // <Left>
                up:         38,     // <Up>
                right:      39,     // <Right>
                down:       40,     // <Down>
            }
        }
    };

    jm = new jsMind(options);  // 初始化 jsMind

    //const jm = new jsMind(options);  // 初始化 jsMind
    fetch('/api/load_mindmap/')
    .then(response => response.json())
    .then(data => {
        if (data && data.format === 'node_tree') { // 確保數據格式為 node_tree，初始化心智圖
            jm.show(data); // 使用 API 獲取的數據初始化心智圖
        } else {
            console.log('無儲存數據');
        }
    })
    .catch(error => console.error('載入錯誤:', error));

    const container = document.getElementById('jsmind_container');
    if (container) {
        container.addEventListener("change", function() {
            const mindMapData = jm.get_data();
            saveMindMapData(mindMapData); // 自動儲存
        });
    } else {
        console.error("無法找到 jsmind_container 元素");
    }

    //jm.show(data);

    const shortcutProvider = new ShortcutProvider(jm, options.shortcut);
    shortcutProvider.init();

};

// 2. 儲存心智圖數據
function saveMindMapData() {
    if (jm) {
        const mindMapData = jm.get_data('node_tree'); // 取得 node_tree 格式數據
        fetch('/api/save_mindmap/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(mindMapData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('儲存錯誤，伺服器返回了錯誤狀態');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                console.log('儲存成功');
                document.getElementById("save-status").innerText = "數據已保存";
            } else {
                console.error('儲存失敗:', data.message);
            }
        })
        .catch((error) => {
            console.error('儲存錯誤:', error);
        });
    } else {
        console.error("jsMind 實例尚未初始化");
    }
}

// 3. 操作時觸發自動儲存
// 監聽心智圖操作事件
document.getElementById("jsmind_container").addEventListener("change", function() {
    //const mindMapData = jm.get_data();
    saveMindMapData(mindMapData); // 每次操作後自動儲存
});

// 4. 當使用者試圖離開頁面時提醒
window.addEventListener("beforeunload", function (e) {
    // 檢查是否有未保存的變更（可以增加條件判斷）
    const confirmationMessage = '您有未保存的變更，確定要離開此頁面嗎？';
    e.returnValue = confirmationMessage; // 設定訊息
    //event.returnValue = confirmationMessage; // 設定訊息，這是標準寫法
    //(e || window.event).returnValue = confirmationMessage; // 這行是針對某些瀏覽器的相容性
    return confirmationMessage;
});


window.addEventListener("pageshow", function(event) {
    if (event.persisted) { // 當頁面來自快取時
        location.reload(); // 強制重新加載頁面
    }
});

// 手動儲存的函數
function saveMindMap() {
    if (jm) {
        const mindMapData = jm.get_data();
        saveMindMapData(mindMapData); // 呼叫儲存心智圖數據的函數
    } else {
        console.error("jsMind 實例尚未初始化");
    }
}

// 登出前自動儲存並登出
function saveAndLogout() {
    if (jm) {
        const mindMapData = jm.get_data();
        saveMindMapData(mindMapData); // 儲存當前數據
        setTimeout(() => {
            document.getElementById("logout-form").submit(); // 提交登出表單
        }, 500); // 延遲 0.5 秒，確保儲存完成後才登出
    } else {
        console.error("jsMind 實例尚未初始化");
    }
}
