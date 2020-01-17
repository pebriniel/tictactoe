

var Options = {

    loadOption: function(skin = 'default') {

        const skinLoad = storage.read('skin');
        if(skinLoad != null){
            skin = skinLoad;
        }

        let element = document.querySelector(`.skins a[data-skin="${skin}"]`);
        if(element){
            element.classList.add('active');
        }

        //On charge le skin
        if(!document.getElementById('id2')) {
            var link = document.createElement('link');

            link.id = 'skin';
            link.rel = 'stylesheet';
            link.href = `/static/assets/skins/${skin}/skin.css`;

            document.head.appendChild(link);
        }
    },

    ButtonSelectSkin: (element) => {
        const skin = element.dataset.skin;

        document.querySelector('.skins .active').classList.remove('active');
        element.classList.add('active');

        storage.write('skin', skin);
    }
}

window.addEventListener("load", event => {
    // storage.write('skin', 'default');

    Options.loadOption();
});
