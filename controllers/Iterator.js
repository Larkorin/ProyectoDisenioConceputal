var IteratorLab = function (list) {
    this.index = 0;
    this.list = list;
}

// Agrega metodos de la clase IteratorLab
IteratorLab.prototype = {
    // Método para posicionar el iterador al principio de la lista y devolver el primer elemento
    first: function () {
        this.reset(); // Llama al metodo reset para reiniciar el indice
        return this.next(); // Llama al metodo next para obtener el primer elemento
    },
    // Metodo para obtener el siguiente elemento de la lista y avanzar el indice
    next: function () {
        // Devuelve el elemento actual e incrementa el indice para apuntar al siguiente
        return this.items[this.index++];
    },
    // Metodo que verifica si hay mas elementos en la lista para iterar
    hasNext: function () {
        // Compara el indice actual con la longitud de la lista para determinar si hay mas elementos
        return this.index <= this.items.length;
    },
    // Metodo para reiniciar el indice y volver al principio de la lista
    reset: function () {
        this.index = 0;
    },
    // Metodo que acepta una funciin de devolución de llamada y la aplica a cada elemento de la lista
    each: function (callback) {
        // Inicia un bucle for, comienza desde el primer elemento, continúa mientras haya mas elementos y avanza al siguiente en cada iteracion
        for (var item = this.first(); this.hasNext(); item = this.next()) {
            // Llama a la función de devolucion de llamada con el elemento actual como argumento
            callback(item);
        }
    }
}
module.exports = IteratorLab;

