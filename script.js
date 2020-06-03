(function () {
    $(".user-input").on("input", function () {
        let userInput = $(".user-input").val(); //grab user input
        console.log("UserInput: ", userInput);
        console.log("UserInput: ", typeof userInput);

        let dropdownSelectVal = $(".select-btn").val(); // grab value of select
        let baseUrl = "https://elegant-croissant.glitch.me/spotify";
        let nextUrl;
        let resultMsg = $("#result-msg");
        let results = $("#results-container");
        let moreBtn = $(".more-btn");
        let noSearch = $(".no-search");

        if (userInput === "") {
            results.addClass("off");
            moreBtn.removeClass("on");
            noSearch.removeClass("off");
            resultMsg.removeClass("on");

            return;
        } else {
            $.ajax({
                url: baseUrl,
                method: "GET",
                data: {
                    query: userInput,
                    type: dropdownSelectVal,
                },

                success: function (response) {
                    response = response.albums || response.artists;
                    setNextUrl(response);

                    results.html(getResultsHtml(response.items));
                    if (response && response.items.length > 0) {
                        resultMsg.html(`Results for ${userInput}:`);
                        noSearch.addClass("off");
                        results.removeClass("off");
                        resultMsg.addClass("on");
                        moreBtn.addClass("on");
                    } else {
                        resultMsg.html("No results for " + userInput);
                        resultMsg.addClass("on");
                    }
                },
            });
        }

        $(".more-btn").on("click", function () {
            $.ajax({
                url: nextUrl,
                success: function (response) {
                    response = response.artists || response.albums;
                    setNextUrl(response);
                    results.append(getResultsHtml(response.items));
                },
            });
        });

        function getResultsHtml(items) {
            let resultsHtml = "";
            let nameHtml = "";
            let imgHtml = "";
            let userInput = $(".user-input").val();

            for (let i = 0; i < items.length; i++) {
                if (items[i].images[0]) {
                    let imgUrl = items[i].images[0].url;
                    imgHtml = "<img class='image' src='" + imgUrl + "' />";
                }
                nameHtml =
                    "<a class='link' href='" +
                    items[i].external_urls.spotify +
                    "'>" +
                    items[i].name +
                    "</a>";
                resultsHtml +=
                    "<div class='item-container'>" +
                    imgHtml +
                    nameHtml +
                    "</div>";
            }
            return resultsHtml;
        }

        function setNextUrl(data) {
            console.log(data);
            console.log("before", nextUrl);
            nextUrl =
                data.next &&
                data.next.replace(
                    "api.spotify.com/v1/search",
                    "elegant-croissant.glitch.me/spotify"
                );

            console.log("after", nextUrl);
        }
    });
})();
