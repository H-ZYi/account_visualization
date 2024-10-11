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
    editable: true, // 啟用節點拖動和編輯
    theme: 'greensea', // 可選主題
    mode: 'full', // 全模式展示
    view: {
        draggable: true, // 整體圖形拖動
        line_style: 'curved', // 線條樣式
        zoom: {
            min: 0.5,
            max: 2.0,
            step: 0.1
        }
    },
    layout: {
        hspace: 30,
        vspace: 20,
        pspace: 13
    },
    shortcut: {
        enable: true, // 啟用快捷鍵
        mapping: {
            addchild: 65, // A 鍵
            addbrother: 66, // B 鍵
            editnode: 69, // E 鍵
            delnode: 46,  // Delete 鍵
            toggle: 32   // 空白鍵切換節點展開/收起
        }
    }
};
const jm = new jsMind(options);
jm.show(minddata);

jm.add_event_listener(function (event_type, data) {
    if (event_type === 'node_click') {
        console.log('Node clicked:', data);
    }
    if (event_type === 'node_dragstart') {
        console.log('Node drag started:', data);
    }
    if (event_type === 'node_dragend') {
        console.log('Node drag ended:', data);
    }
});


jm.draggable_node({node_id: selectedNodeId, x: offsetX, y: offsetY});