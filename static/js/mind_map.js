// 定義心智圖數據
const minddata = {
    "meta": {
        "name": "example",
        "author": "jsMind",
    },
    "format": "node_tree",
    "data": {
        "id": "root", "topic": "帳號管理", "children": [
            { "id": "sub1", "topic": "遊戲帳號" },
            { "id": "sub2", "topic": "金融帳號" },
            { "id": "sub3", "topic": "社交帳號" }
        ]
    }
};

// 初始化心智圖
const options = {
    container: 'jsmind_container',
    editable: true, // 設置為 true 以啟用拖動
    theme: 'greensea',
    layout: {
        hspace: 30,
        vspace: 20,
        pspace: 13,
        draggable: true // 確保 layout 中有 draggable 設定
    },
    view: {
        draggable: true, // 確保視圖中拖動功能開啟
    },
    shortcut: {
        enable: true, // 確保快捷鍵功能啟用
        handles: {
            addchild: 65, // 'A'
            addbrother: 66, // 'B'
            editnode: 69, // 'E'
            delnode: 46 // Delete
        },
        mapping: {
            addchild: 65,
            addbrother: 66,
            editnode: 69,
            delnode: 46
        }
    }
};

// 保留第一個 jm 定義
console.log("Initializing mind map...");
const jm = new jsMind(options);
jm.show(minddata);
console.log("Mind map initialized:", jm);

// 剩餘的程式碼部分直接使用已定義的 jm 變數
jm.add_event_listener(function(type, data) {
    if (type === 'node_click') {
        console.log("Node clicked:", data);
    } else if (type === 'node_dragstart') {
        console.log("Drag start:", data);
    } else if (type === 'node_dragend') {
        console.log("Drag end:", data);
    }
});

// 取得節點容器並監聽 mousedown 事件
const container = document.getElementById('jsmind_container');
container.addEventListener('mousedown', function(e) {
    // 當點擊在節點上時啟動拖動邏輯
    if (e.target.classList.contains('jmnode')) {
        e.preventDefault();

        let selectedNode = e.target;
        let startX = e.clientX;
        let startY = e.clientY;
        let offsetX = 0;
        let offsetY = 0;
        
        // mousemove 用來實現節點移動
        const onMouseMove = (moveEvent) => {
            offsetX = moveEvent.clientX - startX;
            offsetY = moveEvent.clientY - startY;
            selectedNode.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        };
        
        // mouseup 用來結束節點移動並保存位置
        const onMouseUp = () => {
            selectedNode.style.transform = ''; // 清除 transform，以便重置位置
            const finalX = parseInt(selectedNode.style.left || 0) + offsetX;
            const finalY = parseInt(selectedNode.style.top || 0) + offsetY;
            
            // 更新節點位置
            selectedNode.style.left = `${finalX}px`;
            selectedNode.style.top = `${finalY}px`;
            
            // 移除事件監聽器
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        // 綁定 mousemove 和 mouseup 事件
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
});
