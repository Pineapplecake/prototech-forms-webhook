var POST_URL = ""; // Put your webhook url here

function getItems(first, last, response) {
    var items = [];

    for (var i = first; i < last; i++) {
	var question = response[i].getItem().getTitle();
	var answer = response[i].getResponse();
	try {
	    var parts = answer.match(/[\s\S]{1,1024}/g) || [];
	} catch (e) {
	    var parts = answer;
	}

	if (answer == "") {
	    continue;
	}
	for (var j = 0; j < parts.length; j++) {
	    if (j == 0) {
		items.push({
		    "name": question,
		    "value": parts[j],
		    "inline": false
		});
	    } else {
		items.push({
		    "name": question.concat(" (cont.)"),
		    "value": parts[j],
		    "inline": false
		});
	    }
	}
    }

    return items;
};

function onSubmit(e) {
    var form = FormApp.getActiveForm();
    var allResponses = form.getResponses();
    var latestResponse = allResponses[allResponses.length - 1];
    var response = latestResponse.getItemResponses();
    var embeds = [];
    
    // Each "section" of the form is posted in a different embed.
    // Replace these embeds with ones that suit your own form.
    embeds.push({
	"title": "General Info:",
	"color": "4431943",
	"fields": getItems(1, 6, response)
    });
    embeds.push({
	"title": "Minecraft Experience:",
	"color": "4431943",
	"fields": getItems(6, 12, response)
    });
    embeds.push({
	"title": "ProtoTech Plans:",
	"color": "4431943",
	"fields": getItems(12, 21, response)
    });
    embeds.push({
	"title": "Contact Info:",
	"color": "4431943",
	"fields": getItems(21, 25, response)
    });
    embeds.push({
	"title": "Final:",
	"color": "4431943",
	"fields": getItems(25, response.length, response),
	"footer": {
	    "text": "React with 👍 or 👎 to vote."
	}
    });

    var options = {
	"method": "post",
        "headers": {
	    "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
	    "content": "**New Application:** " + response[0].getResponse(),
		"embeds": embeds
	})
    };

    UrlFetchApp.fetch(POST_URL, options);
};
