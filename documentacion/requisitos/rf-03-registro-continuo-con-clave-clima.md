# RF-03 — Registro continuo con clave CLIMA

**Tipo:** Requisito funcional  
**Prioridad sugerida:** alta

## Descripción
Al terminar el registro, el sistema debe solicitar una palabra clave. Si se ingresa exactamente `CLIMA`, debe limpiar los campos para permitir otro registro. Con cualquier otro valor debe mostrar una alerta, ocultar el panel y volver al inicio de sesión.

## Criterios de aceptación
- [ ] Al finalizar el registro aparece la solicitud de clave.
- [ ] CLIMA permite limpiar los campos y continuar.
- [ ] Otra palabra genera una alerta y devuelve al login.
