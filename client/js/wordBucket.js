// var foo;
// function addWord() {
//     // console.log('hi')
//     // r = document.getElementById("confirmAdd");
//     // r.innerHTML = 'hellooooo';
//     //  $.ajax({
//     //       url: "addToWordBank",                  
//     //       type: "get",             
//     //       data:  $('#add_word').serialize(), 
//     //     success: function(response) {
//     //             foo = response;
//     //             console.log(response);
//     //             r.innerHTML = response;
//     //             },
//     //     error: function (stat, err) {
//     //           // r = document.getElementById("showCounter");
//     //             r.innerHTML = 'something went wrong in the kitchen!';
//     //             }       
//     //         });
//     socket.emit('addWord', {word: $('#add_word').serialize()});
// }
function resetWordBank(){
    socket.emit('resetDict');
}
// function incrementClicker() {
//       r = document.getElementById("showCounter");
//       $.ajax({
//           url: "addTwoCookies",                  
//           type: "get",             
//           data:  $('#take_name').serialize(), 
//         success: function(response) {
//                 r.innerHTML = response; 
//                 console.log(temp);
//                 },
//         error: function (stat, err) {
                
//                 }       
//             });
//     }