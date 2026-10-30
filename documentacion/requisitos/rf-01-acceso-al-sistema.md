# RF-01 — Acceso al sistema

**Tipo:** Requisito funcional  
**Prioridad sugerida:** alta

## Descripción
El sistema debe mostrar inicialmente el formulario de inicio de sesión y mantener oculto el panel de trabajo. Debe permitir el acceso únicamente con usuario `CVC` y contraseña `Lluvias`. Si las credenciales son correctas, oculta el login y muestra el panel; si son incorrectas, informa el error y mantiene visible el login.

## Criterios de aceptación
- [ ] Al cargar la página, el panel de trabajo no está visible.
- [ ] Las credenciales CVC / Lluvias permiten entrar.
- [ ] Credenciales diferentes muestran un error y no abren el panel.
