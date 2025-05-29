
document.addEventListener("DOMContentLoaded", function () {
    
    function preventBack() {
                window.history.forward();
            }
            setTimeout(preventBack(), 0);
            window.onunload = function () {
                null;
            };
            document.onreadystatechange = function () {
                if (document.readyState !== "complete") {

                } else {
                    xDm = window.location.href;
                    sessAuth();
                    Csprofile();
                    cschatlist();
                }
            };


            function sessAuth() {
                if (!sessionStorage.getItem('DFGDFGDFEDDUID')) {
                    // If sessionStorage has the value (not empty), redirect to the main page
                    window.location.href = "cs-app-login.html";
                }
            }

            
            function  Csprofile(){
                document.getElementsByClassName("csuserap")[0].textContent = sessionStorage.getItem('FSDFSDFWFDFEFN') +' '+ sessionStorage.getItem('SDF3434SDFEWLN');
            }




             /*OPEN CHAT LIST*/
            // Function to fetch and display chat list items
            function cschatlist() {
                        $.ajax({
                            url: ''+ sessionStorage.getItem('ZXSDSDSDSDURL') +'api/v1/spidcproxy/chatSupportAppGetOAIMS',
                            type: 'GET',
                            dataType: 'json',
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', sessionStorage.getItem('ZXSDSDSDSDUKEY'));
                                // loader.show();
                            },
                            success: function (response) {
                                // loader.hide();
                                // console.log(response); // Check the structure of the response

                                // Check if data and ChatSpecificInformation exist
                                if (response && response.data && response.data.ChatSpecificInformation) {
                                    const jsonData = response;
                                    $(".chat-list").empty(); // Clear existing items
                                    // Get the total number of chat_id entries
                                    const chatCountopen = jsonData.data.ChatSpecificInformation.length;
                                    console.log(jsonData);
                                    jsonData.data.ChatSpecificInformation.forEach(chat => {
                                        const csunseen = chat.unseen_count && chat.unseen_count !== "0"
                                            ? '<span  class="badge rounded-pill bg-primary  ms-1 c-number">' + chat.unseen_count + '</span>'
                                            : ''; // If unseen_count is null or 0, csunseen will be an empty string
                                        $(".chat-list").append(
                                        '<a href="#" class="d-flex align-items-center chat-list-item" data-id="' + chat.chat_id +'-'+ chat.FirstName + ' ' + chat.LastName  + '">\n'
                                        + '<div class="flex-shrink-0">\n'
                                        + '<img class="img-fluid" src="https://cdn-icons-png.flaticon.com/512/1057/1057231.png" width="50" height="50" alt="user img" />\n'
                                        + '<span class="active"></span>\n'
                                        + '</div>\n'
                                        + '<div class="flex-grow-1 ms-3">\n'
                                        + '<h3 class="mt-0 mb-0" style="font-weight: 600;">' + chat.FirstName + ' ' + chat.LastName   + csunseen + '</h3>\n'
                                        + '<p class="mb-0">Tax Payor</p>\n'  
                                        + '</div>\n'  
                                        + '</a>' 
                                    );
                                });
                                  document.getElementsByClassName("cs-open-chat")[0].textContent = chatCountopen;
                                 // Set the active class based on stored data
                                 setActiveItemFromStorage();
                            } else {
                                    //document.getElementsByClassName("cs-open-chat")[0].textContent = "0";
                                   console.error('Unexpected response structure:', response);
                    }
                },
                    error: function (xhr, status, errorThrown) {
                        console.log('Error fetching chat list:', xhr.responseText);
                    }
                });
        }

      


        $(document).on('click', '.chat-list-item', function() {
            // Remove 'active' class from all items
            //$('.chat-list-item').removeClass('active');
            // Add 'active' class to the clicked item
            //$(this).addClass('active');
            // Save the active item's data-id in localStorage
            const itemId = $(this).data('id');
            const parts =  itemId.split('-');
            const ciid = parts[0];  
            const cname = parts[1];  
            sessionStorage.setItem('activeChatItem', ciid);
            sessionStorage.setItem('activeChatItemName', cname);
            cseen(ciid,cname);
            csconvo(ciid,cname);
            

        }); 

            // Function to set the active item based on localStorage
            function setActiveItemFromStorage() {
                //alert(sessionStorage.getItem('activeChatItem'));
             const activeItemId = sessionStorage.getItem('activeChatItem');
             const activeItemName = sessionStorage.getItem('activeChatItemName');
            if (activeItemId != null && activeItemName != null) {
                document.getElementsByClassName("taxtpayorname")[0].textContent = activeItemName;
                   //activeItem.classList.add('active');
                   // alert(activeItemId);
                    //const activeItem = document.querySelector(`.chat-list-item[data-id="${activeItemId}"]`);
                    //activeItem.classList.add('active');
                    //document.getElementsByClassName("taxtpayorname")[0].textContent = sessionStorage.getItem('activeChatItemName');
                    //const activeItemName = sessionStorage.getItem('activeChatItemName');
                    csconvo(activeItemId,activeItemName);
                    //cseen(activeItemId,activeChatItemName);
                   // alert("test");
             
              
            }
        }

/*  SEEN BADGE convo*/
function cseen(asdasdasdciid,gfgfgcname){
            const sdsdsd = {
                "ActionType": "Seen Chat",
                "CID": asdasdasdciid,
                "CMSGID": null,
                "UID": null
            };
            $.ajax({
                type: 'POST',
                async: true,
                cache: false,
                url: ''+ sessionStorage.getItem('ZXSDSDSDSDURL') +'api/v1/spidcproxy/chatSupportAppPostOAIMS',
                data: JSON.stringify(sdsdsd),
                contentType: 'application/json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', sessionStorage.getItem('ZXSDSDSDSDUKEY'));

                },
                success: function (response) {
                    cschatlist();                  
                },
                error: function (xhr, status, errorThrown) {
                    console.log(xhr.responseText); // Log the response text received from the server
                }
            });
        }
        /*END SEEN BADGE convo*/





        
// const cslistItem = document.querySelector("li.repaly");
// const csactionbtn = cslistItem.querySelector(".delsender");

// listItem.addEventListener("mouseenter", () => {
//     csactionbtn.style.display = "inline-block";
// });

// listItem.addEventListener("mouseleave", () => {
//     csactionbtn.style.display = "none";
// });

        /* chat convo*/
        function csconvo(ghjfghfg,kkknamne){
                       
                    $.ajax({
                        url: ''+ sessionStorage.getItem('ZXSDSDSDSDURL') +'api/v1/spidcproxy/chatSupportAppGetOAIMS/'+ ghjfghfg +'',
                        type: 'GET',
                        dataType: 'json',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', sessionStorage.getItem('ZXSDSDSDSDUKEY'));
                            // loader.show();
                        },
                        success: function (response) {
                            // loader.hide();
                            // console.log(response); // Check the structure of the response
                            document.getElementsByClassName("taxtpayorname")[0].textContent = kkknamne;
                            $(".msg-box").empty()
                            // Check if data and ChatSpecificInformation exist
                            if (response && response.data && response.data.ChatSpecificInformation) {
                                const jsonData = response;
                                //console.log(sessionStorage.getItem('DFGDFGDFEDDUID'));
                                //$(".chat-wrapper").empty(); // Clear existing item
                                // Loop through ChatSpecificInformation array and append dynamic data sessionStorage.getItem('DFGDFGDFEDDUID')
                                jsonData.data.ChatSpecificInformation.forEach(chat => {      
                                    const messageClass = chat.sender_id === sessionStorage.getItem('DFGDFGDFEDDUID') ? 'repaly' : 'sender';
                                    var filevalueData;
                                    var chatmessage;
                                    //alert(chat.file_path);
                                    

                                    // Determine the file display based on file type
                                            if (chat.file_type === "image/jpeg" || chat.file_type === "image/png") {
                                                filevalueData = chat.file_path === "Message Unsend" ? chat.file_path 
                                                : `<img src="https://bizportal.silaycity.gov.ph/spidc_web_api_test/CSPluginServer${chat.file_path}" alt="Attachment" onclick="viewFullScreen('https://bizportal.silaycity.gov.ph/spidc_web_api/CSPluginServer${chat.file_path}')" style="cursor: pointer;">`;
                                              
                                            
                                            } else if (chat.file_type === "video/mp4") {
                                                filevalueData = `<video controls><source src="${chat.file_path}" type="video/mp4"></video>`;
                                            } else if (chat.file_type === "application/pdf") {


                                                if(messageClass =="sender"){
                                                    filevalueData = chat.file_path === "Message Unsend" ? chat.file_path 
                                                    : `<a href="https://bizportal.silaycity.gov.ph/spidc_web_api_test/CSPluginServer${chat.file_path}" download="${chat.file_path.split('/').pop()}" style="color: #000;">${chat.file_path.split('/').pop()}</a>`;
                                                   // filevalueData = `<a href="https://bizportal.silaycity.gov.ph/spidc_web_api/CSPluginServer${chat.file_path}" download="${chat.file_path.split('/').pop()}" style="color: #000;">${chat.file_path.split('/').pop()}</a>`;
                                                }else{
                                                    filevalueData = chat.file_path === "Message Unsend" ? chat.file_path 
                                                    : `<a href="https://bizportal.silaycity.gov.ph/spidc_web_api_test/CSPluginServer${chat.file_path}" download="${chat.file_path.split('/').pop()}" style="color: #fff;">${chat.file_path.split('/').pop()}</a>`;
                                                    //filevalueData = `<a href="https://bizportal.silaycity.gov.ph/spidc_web_api/CSPluginServer${chat.file_path}" download="${chat.file_path.split('/').pop()}" style="color: #fff;">${chat.file_path.split('/').pop()}</a>`;
                                                }
                                              
                                            } else {
                                                filevalueData = "";
                                            }




                                            //TIMES AGO POSITION 
                                            // let cstimesagoposition;
                                            // if(messageClass =="sender"){
                                            //     cstimesagoposition='<span style="position: absolute;right: 0;margin-top: 56px;color: #837e7e;margin-right: 88%;">'+chat.sent_at+'</span>';
                                            // }else{
                                            //     cstimesagoposition='<span style="position: absolute;right: 0;margin-top: 56px;color: #837e7e;margin-right: 90%;">'+chat.sent_at+'</span>';
                                            // }

                                            // Construct chat message with optional file attachment
                                            if (chat.message !== "" || chat.file_path !== "") {
                                                chatmessage = `<li class="${messageClass} mb-4" style="position: relative;">`;
                                                   //'' console.log(chat.message);
                                        
                                                // Append the message if it exists 
                                                if (chat.message !== "") {
                                                    const cstimesentmesageheightDisplaywhen = chat.message ==="Message Unsend" ? 'display: none;':'';
                                                    const msgbx = chat.message ==="Message Unsend" ? '<span class="csthaction me-1 fw-bold"></span><p>'+chat.message+'</p>' 
                                                    : '<span class="csthaction me-1 fw-bold" data-id="'+chat.message_id+'"><i class="fa fa-trash csicon" aria-hidden="true"></i> Unsend</span><p>'+chat.message+'</p><span style="position: absolute;right: 0;margin-top: 56px;color: #837e7e;">'+timeAgo(chat.sent_at)+'</span>';
                                                    //const msgbx = '<span class="csthaction me-1 fw-bold"><i class="fa fa-trash csicon" aria-hidden="true"></i> Unsend</span><p>'+chat.message+'</p>'
                                                    const csboxmessagewithaction = chat.sender_id === sessionStorage.getItem('DFGDFGDFEDDUID') ? msgbx
                                                    : '<p>'+chat.message+'</p><span style="position: absolute;right: 0;margin-top: 56px;color: #837e7e;margin-right: 93%; '+cstimesentmesageheightDisplaywhen+'">' + timeAgo(chat.sent_at) + '</span>';
                                                    //const csboxmessagewithaction ='<span class="csthaction me-1">test</span><p>'+chat.message+'</p>';
                                                    //chatmessage += `<span class="delsender me-1">test</span><p>${chat.message}</p><span class="delrepaly"></span>`;
                                                    chatmessage +=csboxmessagewithaction;
                                                }


                                                // Append the file attachment if it exists
                                                if (filevalueData !== "") {

                                                    const cstimesentheightDisplaywhen = chat.file_path ==="Message Unsend" ? 'display: none;':'';
                                                    //console.log(cstimesentheightDisplaywhen);
                                                    const cstimesentheight = chat.file_type ==="application/pdf" ? '56':'135';
                                                    
                                                    const cstimesentsendertype = chat.sender_id === sessionStorage.getItem('DFGDFGDFEDDUID') ? '<span style="position: absolute;right: 0;margin-top: '+cstimesentheight+'px;color: #837e7e;">' + timeAgo(chat.sent_at)+ '</span>'
                                                    : '<span style="position: absolute;right: 0;margin-top: '+cstimesentheight+'px;color: #837e7e;margin-right: 93%; '+cstimesentheightDisplaywhen+'">' + timeAgo(chat.sent_at)+ '</span>';
                                                   
                                                     const cstimesent = chat.file_type ==="image/jpeg" || chat.file_type === "image/png"? cstimesentsendertype:cstimesentsendertype;
                                                     const filemsgbx = chat.file_path ==="Message Unsend" ? '<span class="csthaction me-1 fw-bold"></span><p>'+filevalueData+'</p>' 
                                                     : '<span class="csthaction me-1 fw-bold" data-id="'+chat.message_id+'"><i class="fa fa-trash csicon" aria-hidden="true"></i> Unsend</span><p>'+filevalueData+'</p>'+cstimesent+'';
                                                    const csboxfilevalueDatawithaction = chat.sender_id === sessionStorage.getItem('DFGDFGDFEDDUID') ? filemsgbx
                                                    : '<p>'+filevalueData+'</p>'+cstimesent+'';
                                                    chatmessage += csboxfilevalueDatawithaction;
                                                }

                                                chatmessage += `</li>`;  // Close the sender <li> element

                                                // Append to chat-wrapper
                                                $(".msg-box").append(chatmessage);
                                            }


                            });
                          
                             // Call scrollToBottom on load
                             scrollToBottom();


                        } else {
                                console.error('Unexpected response structure:', response);
                }
                },
                error: function (xhr, status, errorThrown) {
                    console.log('Error fetching chat convo:', xhr.responseText);
                }
                });
        }

        /*  chat timestamp*/
   function timeAgo(dateString) {
    const now = new Date();
    const then = new Date(dateString);
    const diff = now - then;

    if (diff < 1000) {
        return "just now";  // Show "just now" for times under 1 second
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ago`;
    }
    if (hours > 0) {
        return `${hours}h ago`;
    }
    if (minutes > 0) {
        return `${minutes}m ago`;
    }
    return `${seconds}s ago`;
        }
        /* end chat timestamp*/

      



        $('.cslogout').click(function(){
            sessionStorage.clear();
            setTimeout(function() {
                window.location.href = "cs-app-login.html";
            }, 1000);
        });



        /* Input File Data Checker */
        const fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                // At this point, the file is read into memory.
                // You can now check the file type directly from the File object
                if (file.type.startsWith('video/')) {
              alert('Video files are not allowed');
        } else {
            //alert('File is OK');
        }
        };
        // Start reading the file as a data URL (base64 encoded string)
        reader.readAsDataURL(file);
        } else {
            alert('No file selected');
        }
        });
        /*end Input File Data Checker */




      



        //Send Chat
        $('#btnmessagesend').click(function () {
              // alert("test");
              sendChat();
              
        });


   
        document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // Check if the pressed key is Enter
        event.preventDefault(); // Prevent the default form submission behavior
        sendChat(); // Call the same function
       // alert("test");
    }
});



    function sendChat() {
        //alert('Button clicked!');
        if (document.getElementById('chatmessage').value.trim() == ''  && fileInput.files.length === 0)  {

        }else{
        const file = fileInput.files[0];
        var message = document.getElementById('chatmessage').value.trim();
        const uID = sessionStorage.getItem('DFGDFGDFEDDUID');
        const cID = sessionStorage.getItem('activeChatItem');
        const csscname = sessionStorage.getItem('activeChatItemName');
        uploadFile(file,message,uID,cID,csscname)
        cseen(cID,csscname);
        document.getElementById('file-input').value = '';
        document.getElementById('chatmessage').value = '';
        }
    }




function uploadFile(file, message, uID, cID,cccname) {
//if (!file) {
    // If there is no file, handle it as needed
    $.ajax({
        type: "POST",
        url: "ChatSupport.aspx/SaveFile",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ fileName: null, fileData: null, fileType: null, message: message, uID: uID, cID: cID }),
        success: function (response) {
            console.log(response.d);
            csconvo(cID,cccname);
             // Call scrollToBottom on load
             scrollToBottom();
            $('#fileInput').val('');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
            alert('Error: ' + xhr.responseText); // Show detailed error
        }
    });
    return; // Exit the function early
//}


}


    //upload file attachment
    fileInput.addEventListener('change', () => {
                var reader = new FileReader();
                const file = fileInput.files[0];
                const uID = sessionStorage.getItem('DFGDFGDFEDDUID');
                const cID = sessionStorage.getItem('activeChatItem');
                const ccname = sessionStorage.getItem('activeChatItemName');
                reader.onloadend = function () {
                    var fileData = reader.result.split(',')[1]; // Remove data URL prefix
                    $.ajax({
                        type: "POST",
                        url: "ChatSupport.aspx/SaveFile",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ fileName: file.name, fileData: fileData, fileType: file.type, message: null, uID: uID, cID: cID }),
                        success: function (response) {
                            console.log(response.d);
                            csconvo(cID,ccname);
                             // Call scrollToBottom on load
                             scrollToBottom();
                        },
                        error: function (xhr, status, error) {
                            console.log(xhr.responseText);
                            alert('Error: ' + xhr.responseText); // Show detailed error
                        }
                    });
                    //alert("test");
                };
                reader.readAsDataURL(file); // Convert file to Base64
        });



       

// Function to scroll to the bottom
const modalBody = document.querySelector('.modal-body');
    function scrollToBottom() {
        if (modalBody) {
            modalBody.scrollTop = modalBody.scrollHeight;
        }
    }
    
   

//Unsend message
    $(document).on('click', '.csthaction', function() {
           
            // Save the active item's data-id in localStorage
            const mgsid = $(this).data('id');
            const csucid = sessionStorage.getItem('activeChatItem');
            const csucname = sessionStorage.getItem('activeChatItemName');
            //scrollToBottom();
          // alert(mgsid);
          csunsendmessage(mgsid,csucid,csucname);
           
        });

    

     function csunsendmessage(dfdfmgsid,dfdfcsucid,hghghcsucname){
            
            //alert(dfdf);
            const dsfsdfsdf = {
                "ActionType": "Unsend Message",
                "UID": null,
                "CMSGID": dfdfmgsid
            };
            $.ajax({
                type: 'POST',
                async: true,
                cache: false,
                url: ''+ sessionStorage.getItem('ZXSDSDSDSDURL') +'api/v1/spidcproxy/chatSupportAppPostOAIMS',
                data: JSON.stringify(dsfsdfsdf),
                contentType: 'application/json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', sessionStorage.getItem('ZXSDSDSDSDUKEY'));

                },
                success: function (response) {
                    console.log(response);
                    csconvo(dfdfcsucid,hghghcsucname);


                },
                error: function (xhr, status, errorThrown) {
                    console.log(xhr.responseText); // Log the response text received from the server
                }
            });
       }




      
       loadchatlist();
function loadchatlist() {
            // Set an interval to call csconvo every 2 seconds
            setInterval(() => {
                    cschatlist();
            }, 2000); // Adjust the interval as needed (2000 milliseconds = 2 seconds)
        }






   });
   //end of document ready








   function logmeout(){
        const checkbox = document.getElementById('flexSwitchCheckChecked');
        const statusText = document.getElementById('csuserstatus');
        
        if (checkbox.checked) {
            statusText.textContent = 'Online';
        } else {
            //statusText.textContent = 'Offline';
            sessionStorage.clear();
            setTimeout(function() {
                window.location.href = "cs-app-login.html";
            }, 1000);
        }
   }


   function viewFullScreen(src) {
            const fullScreenContainer = document.createElement('div');
            fullScreenContainer.style.position = 'fixed';
            fullScreenContainer.style.top = '0';
            fullScreenContainer.style.left = '0';
            fullScreenContainer.style.width = '100%';
            fullScreenContainer.style.height = '100%';
            fullScreenContainer.style.backgroundColor = 'rgba(0,0,0,0.8';
            fullScreenContainer.style.display = 'flex';
            fullScreenContainer.style.alignItems = 'center';
            fullScreenContainer.style.justifyContent = 'center';
            fullScreenContainer.style.zIndex = '1000';
            fullScreenContainer.style.cursor = 'pointer';
            
            const img = document.createElement('img');
            img.src = src;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            fullScreenContainer.appendChild(img);

            const closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '20px';
            closeButton.style.right = '20px';
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.border = 'none';
            closeButton.style.padding = '10px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => document.body.removeChild(fullScreenContainer);
            fullScreenContainer.appendChild(closeButton);

            fullScreenContainer.onclick = () => document.body.removeChild(fullScreenContainer);

            document.body.appendChild(fullScreenContainer);

            document.addEventListener('keydown', function handleEscKey(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(fullScreenContainer);
                    document.removeEventListener('keydown', handleEscKey);
                }
            });
        }
    
   
