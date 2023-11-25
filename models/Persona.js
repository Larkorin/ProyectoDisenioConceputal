class PersonaAbstractFactory {
    crearAlumno(cedula, nombre, telefono, email, fecha_de_nacimiento, carrera) {
        return new Alumno({
            cedula,
            nombre,
            telefono,
            email,
            fecha_de_nacimiento,
            carrera
        });
    }

    crearProfesor(cedula, nombre, telefono, email) {
        return new Profesor({
            cedula, 
            nombre, 
            telefono,
             email
        });
    }
}