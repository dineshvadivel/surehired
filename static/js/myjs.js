
$(document).ready(function () {
    $(document).on('click', '[data-toggle="lightbox"]', function (event) {
        event.preventDefault();
        $(this).ekkoLightbox({
            wrapping: true
        });
    });

    $(function () {
        $(document).scroll(function () {
            var $nav = $(".fixed-top");
            $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
        });
    });

    /* Preload Images */
    function preloadImages(arrOfImages) {
        for (var i = 0; i < arrOfImages.length; i++) {
            imageToLoad = new Image();
            imageToLoad.src = '../static/images/bg-images/' + arrOfImages[i];
        }
    }

    function loadBg() {
        var backgroundImages = ["cover.jpg", "bg1.jpg", "bg2.jpg", "bg3.jpg", "bg4.jpg", "bg5.jpg"];
        preloadImages(backgroundImages);

        var currIndex = 1;
        setInterval(function () {
            if (currIndex == backgroundImages.length) {
                currIndex = 0;
            }

            var img = backgroundImages[currIndex];

            $('.hero').css({ "background-image": "url('../static/images/bg-images/" + img + "')" });
            currIndex++;
        }, 2000);
    }
    window.onload = loadBg();
});