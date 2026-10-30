# RF-04 — Duración y ajuste por horario

**Tipo:** Requisito funcional  
**Prioridad sugerida:** alta

## Descripción
El sistema debe calcular la duración del evento restando la hora de inicio a la hora de fin y expresarla en minutos. También debe identificar si la lluvia comenzó entre las 3:00 p. m. y las 6:00 p. m. para aplicar el ajuste del 5.3 % indicado por el caso.

## Criterios de aceptación
- [ ] La duración se expresa en minutos.
- [ ] Se evalúa la hora de inicio del evento.
- [ ] Si inicia entre 3:00 p. m. y 6:00 p. m., se aplica el ajuste del 5.3 %.
- [ ] El sentido del ajuste (sumar o restar) debe confirmarse antes de implementarlo.
