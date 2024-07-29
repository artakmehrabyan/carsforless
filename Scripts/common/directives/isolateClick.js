function isolateClick() {
    return {
        link: function(scope, elem) {
            elem.on('click',
                function(e) {
                    e.stopPropagation();
                });
        }
    };
}