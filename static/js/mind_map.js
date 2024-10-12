window.onload = function() {
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

    const options = {
        container: 'jsmind_container', // 容器的ID
        editable: true,              // 是否启用编辑
        theme: 'greensea',           // 主题
        mode :'full',                // 布局模式
        support_html : true,         // 是否支持节点里的HTML元素
        log_level: 'disable',        // 日志级别
        view: {
        /*  engine: 'svg',           // 思维导图各节点之间线条的绘制引擎
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

    const jm = new jsMind(options);
    jm.show(minddata);

    const container = document.getElementById('jsmind_container');
    let isDragging = false;
    let startX, startY;
    let currentTranslateX = 0, currentTranslateY = 0;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - currentTranslateX;
        startY = e.clientY - currentTranslateY;
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentTranslateX = e.clientX - startX;
        currentTranslateY = e.clientY - startY;
        container.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px)`;
    });

    // 結束拖動時恢復游標樣式
    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });
};
