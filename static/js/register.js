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

// 查找顯示密碼的勾選框和密碼輸入框
const passwordInput = document.querySelector('#password'); // 密碼欄位 ID 為 'password'
const togglePassword = document.querySelector('#show-password'); // 勾選框的 ID

// 添加事件監聽器來處理勾選框的狀態
togglePassword.addEventListener('change', function () {
    // 切換 input 的 type 屬性在 'password' 和 'text' 之間
    if (this.checked) {
        passwordInput.type = 'text'; // 顯示密碼
    } else {
        passwordInput.type = 'password'; // 隱藏密碼
    }
});