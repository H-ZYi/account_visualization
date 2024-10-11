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
        container: 'jsmind_container',
        editable: true,
        theme: 'greensea',
        view: {
            draggable: true,
            zoom: { min: 0.5, max: 2.0, step: 0.1 }
        },
        shortcut: {
            enable: true,
            mapping: {
                addchild: 65, addbrother: 66, editnode: 69, delnode: 46, toggle: 32
            }
        }
    };

    const jm = new jsMind(options);
    jm.show(minddata);

    const shortcutProvider = new ShortcutProvider(jm, options.shortcut);
    shortcutProvider.init();
};
