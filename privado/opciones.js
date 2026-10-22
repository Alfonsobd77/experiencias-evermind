/* Página privada (/privado): las tres experiencias, las ideas para inspirarse (destinos con ejemplos, no se seleccionan)
   y las preguntas finales. La usan la página (privado.js) y el servidor (Apps Script, vía bundle.sh), para validar
   exactamente los mismos códigos. Para cambiar un texto, se cambia aquí. */
(function (root) {
  'use strict';
  root.PRIVADO = {
    experiences: [
      { id: 'discover', tab: 'Discover Spain', title: 'Discover Spain', kicker: 'Viaje privado por España', img: 'img/bodega.jpg',
        credit: 'Calado en Aranda de Duero · Foto: David Adam Kess, CC BY-SA 4.0',
        lead: 'Un recorrido privado por España, creado desde cero según sus intereses, fechas y ritmo. Los destinos, las estancias y los encuentros se eligen para usted.',
        points: ['Encuentros con bodegueros, chefs y artesanos en sus propios espacios.', 'Pazos, casas históricas y hoteles boutique, elegidos uno a uno.',
          'Traslados privados, horarios flexibles y tiempo para disfrutar a su ritmo.', 'Un interlocutor de Evermind de principio a fin.'],
        example: 'Por ejemplo: dos días entre viñedos y bodegas de La Rioja, desde Madrid.' },
      { id: 'camino', tab: 'El Camino', title: 'El Camino de Santiago, en privado', kicker: 'Con los suyos, en sus fechas', img: 'img/obradoiro.jpg',
        credit: 'Fachada do Obradoiro, Santiago · Foto: Stegop, CC BY-SA 4.0',
        lead: 'Recorra el Camino hasta Santiago con su grupo, en las fechas que elija y a su ritmo. Nos ocupamos de los detalles.',
        points: ['Guía privado para descubrir la historia y los lugares del Camino.', 'Vehículo de apoyo durante las etapas, según el itinerario.',
          'Pazos y hoteles boutique, con traslados cuando sea necesario.', 'La llegada a la plaza del Obradoiro y una cena para celebrarlo.'],
        example: 'Por ejemplo: de Sarria a Santiago en ocho días. También en recorridos más cortos.' },
      { id: 'medida', tab: 'A medida', title: 'Experiencias a medida', kicker: 'Dentro y fuera de España', img: 'img/jerez.jpg',
        credit: 'Real Escuela Andaluza del Arte Ecuestre, Jerez · Foto: El Pantera, CC BY-SA 4.0',
        lead: 'Diseñamos cada experiencia alrededor de lo que desea celebrar, compartir o descubrir.',
        points: ['Celebraciones y aniversarios.', 'Viajes para reunir a varias generaciones.', 'Encuentros con clientes o socios.', 'Escapadas entre amigos.'],
        example: 'Por ejemplo: tres días entre viñedos, cultura y toro bravo, de Segovia a Salamanca.' }
    ],
    ideas: [
      { id: 'madrid', place: 'Madrid', title: 'El arte y la mesa', img: 'img/madrid.jpg',
        text: 'Madrid, de la mano de quienes mejor la conocen.',
        examples: ['Arte con guía privado', 'Un mercado local', 'Una mesa especial'] },
      { id: 'vino', place: 'La Rioja y Ribera del Duero', title: 'Tierra de vinos', img: 'img/vino.jpg',
        credit: 'Viñedos en Briñas, La Rioja · Foto: Shaury, CC BY-SA 2.0',
        text: 'Bodegas centenarias, viñedos y las personas que hacen el vino.',
        examples: ['Una bodega centenaria', 'Cata entre barricas', 'Almuerzo entre viñedos'] },
      { id: 'dehesa', place: 'Salamanca y Segovia', title: 'La dehesa', img: 'img/dehesa.jpg',
        credit: 'Dehesa en Ledesma, Salamanca · Foto: LBM1948, CC BY-SA 4.0',
        text: 'El campo charro, el toro bravo y dos ciudades llenas de historia.',
        examples: ['Una ganadería de toro bravo', 'Segovia y su Alcázar', 'Salamanca al atardecer'] },
      { id: 'andalucia', place: 'Sevilla, Córdoba y Jerez', title: 'Andalucía', img: 'img/andalucia.jpg',
        credit: 'Patio cordobés · Foto: xavier.estruch, CC BY-SA 2.0',
        text: 'Patios, caballos y flamenco, más allá de las postales.',
        examples: ['Los patios de Córdoba', 'Caballos en Jerez', 'Flamenco en un espacio íntimo'] },
      { id: 'camino', place: 'Galicia', title: 'El Camino de Santiago', img: 'img/camino.jpg',
        credit: 'Camino Primitivo, Galicia · Foto: Simon Burchell, CC BY-SA 4.0',
        text: 'Los últimos kilómetros hasta Santiago, a su ritmo.',
        examples: ['El Camino en privado', 'Noches en pazos gallegos', 'La llegada al Obradoiro'] }
    ],
    questions: [
      { id: 'conquien', q: '¿Con quién viajaría?', options: [
        { v: 'solo', label: 'Solo' }, { v: 'pareja', label: 'En pareja' }, { v: 'familia', label: 'En familia' },
        { v: 'amigos', label: 'Con amigos' }, { v: 'clientes', label: 'Con clientes o socios' }] },
      { id: 'dias', q: '¿Cuántos días le gustaría viajar?', options: [
        { v: '2-3', label: '2 a 3 días' }, { v: '4-6', label: '4 a 6 días' }, { v: '7-10', label: '7 a 10 días' },
        { v: 'mas10', label: 'Más de 10 días' }, { v: 'nose', label: 'Aún no lo tengo claro' }] },
      { id: 'cuando', q: '¿Cuándo le gustaría viajar?', options: [
        { v: 'pronto', label: 'En los próximos meses' }, { v: 'primavera27', label: 'Primavera de 2027' }, { v: 'verano27', label: 'Verano de 2027' },
        { v: 'otono27', label: 'Otoño de 2027' }, { v: 'nose', label: 'Aún no lo tengo claro' }] },
      { id: 'tipo', q: '¿Qué tipo de experiencia busca?', help: 'Puede elegir una o varias.', multi: true, options: [
        { v: 'discover', label: 'Un viaje privado por España' }, { v: 'camino', label: 'El Camino de Santiago' }, { v: 'medida', label: 'Una ocasión especial' },
        { v: 'vino', label: 'Vino y gastronomía' }, { v: 'cultura', label: 'Arte y cultura' }, { v: 'tradiciones', label: 'Tradiciones: toro bravo, caballos, flamenco' },
        { v: 'naturaleza', label: 'Naturaleza y descanso' }] },
      { id: 'comentarios', q: '¿Algo más que debamos saber?', help: 'Opcional: fechas, número de personas o algún deseo especial…', text: true }
    ],
    contactPref: [{ v: 'whatsapp', label: 'WhatsApp' }, { v: 'llamada', label: 'Llamada' }, { v: 'email', label: 'Email' }],
    whatsapp: '+1 781 428 0026',
    whatsappUrl: 'https://wa.me/17814280026'
  };

  /* Texto legible de una respuesta (para la ficha, el resumen y los emails). */
  root.PRIVADO.label = function (id, v) {
    var q = root.PRIVADO.questions.filter(function (x) { return x.id === id; })[0];
    if (!q || q.text) return v || '';
    var one = function (code) { var o = q.options.filter(function (x) { return x.v === code; })[0]; return o ? o.label : ''; };
    return Array.isArray(v) ? v.map(one).filter(Boolean).join(', ') : one(v);
  };
})(typeof window !== 'undefined' ? window : this);
