ymaps.ready(['AnimatedLine']).then(init);

function init(ymaps) {
    // Создаем карту.
    var myMap = new ymaps.Map("map", {
        center: [53.94607584, 27.63928424],
        zoom: 14
    }, {
        searchControlProvider: 'yandex#search'
    });
    var myGeoObject = new ymaps.GeoObject({
        // Описание геометрии.
        geometry: {
            type: "Point",
            coordinates: [53.94587493, 27.63723735]
        },
        // Свойства.
        properties: {
            // Контент метки.
            iconContent: 'Мы тут',
        }
    }, {
        // Опции.
        // Иконка метки будет растягиваться под размер ее содержимого.
        preset: 'islands#blackStretchyIcon',
        // Метку можно перемещать.
        draggable: false
    })
    myMap.geoObjects.add(myGeoObject);

    // Создаем ломаные линии.
    var firstAnimatedLine = new ymaps.AnimatedLine([
        [53.94855842, 27.65869502],
        [53.94992541, 27.65981082],
        [53.95038107, 27.66187076],
        [53.94754580, 27.66461734],
        [53.94678632, 27.66624812],
        [53.94516605, 27.66375903],
        [53.94450780, 27.65715007],
        [53.94227979, 27.65165690], //общий перекресток
        [53.94174809, 27.64594916],
        [53.94411537, 27.63680819],
        [53.94538125, 27.63783816],
        [53.94572302, 27.63672236]
    ], {}, {
        // Задаем цвет.
        strokeColor: "#ED4543",
        // Задаем ширину линии.
        strokeWidth: 5,
        // Задаем длительность анимации.
        animationTime: 4000
    });
    var secondAnimatedLine = new ymaps.AnimatedLine([
        [53.93446816, 27.65086297],
        [53.93561404, 27.65577678],
        [53.93751322, 27.65448932],
        [53.94102015, 27.65348081],
        [53.94146325, 27.65300874],
        [53.94227979, 27.65165690], //общий перекресток
        [53.94174809, 27.64594916],
        [53.94411537, 27.63680819],
        [53.94538125, 27.63783816],
        [53.94572302, 27.63672236]
    ], {}, {
        strokeColor: "#1E98FF",
        strokeWidth: 5,
        animationTime: 4000
    });
    // Добавляем линии на карту.
    myMap.geoObjects.add(firstAnimatedLine);
    myMap.geoObjects.add(secondAnimatedLine);

    var line

    var ListBoxLayout = ymaps.templateLayoutFactory.createClass(
    "<button id='my-listbox-header' class='btn btn-success dropdown-toggle' data-toggle='dropdown'>" +
        "{{data.title}} <span class='caret'></span>" +
    "</button>" +
    // Этот элемент будет служить контейнером для элементов списка.
    // В зависимости от того, свернут или развернут список, этот контейнер будет
    // скрываться или показываться вместе с дочерними элементами.
    "<ul id='my-listbox'" +
        " class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu'" +
        " style='display: {% if state.expanded %}block{% else %}none{% endif %};'></ul>", {

    build: function() {
        // Вызываем метод build родительского класса перед выполнением
        // дополнительных действий.
        ListBoxLayout.superclass.build.call(this);

        this.childContainerElement = $('#my-listbox').get(0);
        // Генерируем специальное событие, оповещающее элемент управления
        // о смене контейнера дочерних элементов.
        this.events.fire('childcontainerchange', {
            newChildContainerElement: this.childContainerElement,
            oldChildContainerElement: null
        });
    },

    // Переопределяем интерфейсный метод, возвращающий ссылку на
    // контейнер дочерних элементов.
    getChildContainerElement: function () {
        return this.childContainerElement;
    },

    clear: function () {
        // Заставим элемент управления перед очисткой макета
        // откреплять дочерние элементы от родительского.
        // Это защитит нас от неожиданных ошибок,
        // связанных с уничтожением dom-элементов в ранних версиях ie.
        this.events.fire('childcontainerchange', {
            newChildContainerElement: null,
            oldChildContainerElement: this.childContainerElement
        });
        this.childContainerElement = null;
        // Вызываем метод clear родительского класса после выполнения
        // дополнительных действий.
        ListBoxLayout.superclass.clear.call(this);
    }
}),

// Также создадим макет для отдельного элемента списка.
ListBoxItemLayout = ymaps.templateLayoutFactory.createClass(
    "<li><a>{{data.content}}</a></li>"
),

// Создадим 2 пункта выпадающего списка
listBoxItems = [
    new ymaps.control.ListBoxItem({
        data: {
            content: 'МКАД',

        }
    }),
    new ymaps.control.ListBoxItem({
        data: {
            content: 'Метро Восток'
        }
    })
],

// Теперь создадим список, содержащий 2 пункта.
listBox = new ymaps.control.ListBox({
        items: listBoxItems,
        data: {
            title: 'Выберите маршрут'
        },
        options: {
            // С помощью опций можно задать как макет непосредственно для списка,
            layout: ListBoxLayout,
            // так и макет для дочерних элементов списка. Для задания опций дочерних
            // элементов через родительский элемент необходимо добавлять префикс
            // 'item' к названиям опций.
            itemLayout: ListBoxItemLayout
        }
    });

listBox.events.add('click', function (e) {
    // Получаем ссылку на объект, по которому кликнули.
    // События элементов списка пропагируются
    // и их можно слушать на родительском элементе.
    var item = e.get('target');
    // Клик на заголовке выпадающего списка обрабатывать не надо.
    if (item != listBox) {
        if (item.data.get('content') == 'МКАД') {
            line = firstAnimatedLine;
            playAnimation()
        }
        else {
            line = secondAnimatedLine;
            playAnimation()
        };
    }

});

myMap.controls.add(listBox, {float: 'left'});
    // Функция анимации пути.
    function playAnimation() {
        // Убираем вторую линию.
        firstAnimatedLine.reset();
        secondAnimatedLine.reset();
        // Анимируем первую линию.
        line.animate()
    }
    // Запускаем анимацию пути.
    playAnimation();
}
