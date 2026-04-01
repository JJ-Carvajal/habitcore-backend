console.log("✅ El archivo auth.js ha cargado correctamente");

// ==========================================
// 0. PROTECCIÓN DE RUTA (AL PRINCIPIO)
// ==========================================
// Si no hay token y el usuario NO está en login o registro, lo sacamos de inmediato.
(function() {
    const token = localStorage.getItem('token');
    const path = window.location.pathname;

    // Si intenta entrar al Dashboard (index/admin) sin token, lo mandamos al login
    if (!token && !path.includes('login.html') && !path.includes('registro.html')) {
        window.location.replace('login.html');
    }
    
    // Si YA tiene token e intenta entrar al login, lo mandamos al index
    if (token && (path.includes('login.html') || path.includes('registro.html'))) {
        window.location.replace('index.html');
    }
})();

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});

// ==========================================
// 1. FUNCIONALIDAD VER/OCULTAR CONTRASEÑA
// ==========================================
function initTogglePassword(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = btn.querySelector('i');
        icon.classList.toggle('fa-eye', !isPassword);
        icon.classList.toggle('fa-eye-slash', isPassword);
    });
}

initTogglePassword('toggle-password-login', 'password-login');
initTogglePassword('toggle-password-registro', 'password');


// ==========================================
// 2. VALIDACIÓN DE SEGURIDAD EN TIEMPO REAL
// ==========================================
const passwordInput = document.getElementById('password');
const passwordMsg = document.getElementById('password-msg');

if (passwordInput && passwordMsg) {
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        let mensajeError = "";

        if (val.length > 0 && val.length < 8) {
            mensajeError = "La contraseña debe tener al menos 8 caracteres.";
        } else if (val.includes("123")) {
            mensajeError = "Contraseña muy débil (no uses '123').";
        } else if (val.length > 0 && !/(?=.*[A-Z])(?=.*\d)/.test(val)) {
            mensajeError = "Incluye al menos una mayúscula y un número.";
        }

        if (mensajeError) {
            passwordMsg.textContent = mensajeError;
            passwordMsg.style.display = 'block';
            passwordInput.parentElement.style.borderColor = '#ff4d4d'; 
        } else {
            passwordMsg.style.display = 'none';
            passwordInput.parentElement.style.borderColor = 'var(--primary)'; 
        }
    });
}


// ==========================================
// 3. MANEJO DE REGISTRO
// ==========================================
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre_usuario = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (password.length < 8 || password.includes("123") || !/(?=.*[A-Z])(?=.*\d)/.test(password)) {
            alert("⚠️ Por favor, mejora la seguridad de tu contraseña.");
            return; 
        }

        try {
            const res = await fetch('https://habitcore-backend.onrender.com/api/auth/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_usuario, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                alert("¡Cuenta creada!");
                window.location.href = 'login.html';
            } else {
                alert(data.message || "Error");
            }
        } catch (error) {
            alert("Error de conexión");
        }
    });
}


// ==========================================
// 4. MANEJO DE LOGIN
// ==========================================
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email-login').value.trim();
        const password = document.getElementById('password-login').value;

        try {
            const res = await fetch('https://habitcore-backend.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                // Usamos REPLACE al loguear para limpiar historial
                window.location.replace(data.usuario.rol === 'admin' ? 'admin.html' : 'index.html');
            } else {
                alert(data.message || 'Error en login');
            }
        } catch (error) {
            alert('Error de conexión');
        }
    });
}

// ==========================================
// 5. CERRAR SESIÓN
// ==========================================
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
        localStorage.clear();
        sessionStorage.clear();
        // Usamos REPLACE al salir
        window.location.replace('login.html');
    });
}