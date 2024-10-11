// register.js

document.querySelector('form').onsubmit = function(event) {
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    // 檢查密碼是否匹配
    if (password !== passwordConfirm) {
        event.preventDefault();
        alert('密碼和確認密碼不匹配，請重新輸入！');
    }
};
