var list = $("#list");

function joinGame(documentId){
    var myDivId = document.getElementById(documentId);

    socket.emit('updateTable', {
        divId: documentId,
    });
}

// $(document).on("click", "#add-item", function(){
// 	var listItem = $("<li class='list-item'>Things go here<button class='remove-item'>Remove</button></li>");
// 	list.append(listItem);
// 	var listItems = $(".list-item");
// 	updateLayout(listItems);

// });

// $(document).on("click", ".remove-item", function(){
// 	$(this).parent().remove();
// 	var listItems = $(".list-item");
// 	updateLayout(listItems);
// });