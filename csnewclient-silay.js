 document.addEventListener("DOMContentLoaded", function () {
    document.onreadystatechange = function () {
        if (document.readyState !== "complete") {
        } else {
            csplugindist();
        }
    };
});

function csplugindist() {
//Check if the CSS file is already in the document
    if (!document.querySelector('link[href="https://jakajay113.github.io/csplugin/csnewclient-silay.css"]')) {
        // Create the <link> element for CSS
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://jakajay113.github.io/csplugin/csnewclient-silay.css";
    
        // Find the div with class "csplguin-section"
        const pluginSection = document.querySelector(".csplguin-section");
        
        if (pluginSection) {
            // Insert the CSS link before the plugin section div
            pluginSection.parentNode.insertBefore(cssLink, pluginSection);
    
            // Check if the chatbox has not been rendered yet
            if (!pluginSection.querySelector('.chatbox-holder')) {
                pluginSection.innerHTML = `
                    <div class="chatbox-holder">
                        <div class="chatbox">
                            <div class="chatbox-top">
                                <div class="chatbox-avatar">
                                    <a href="#">
                                        <img src="https://bizportal.silaycity.gov.ph/favicon.ico"/>
                                    </a>
                                </div>
                                <div class="chat-partner-name">
                                    <span class="status online"></span>
                                    <a href="#">Chat</a>
                                </div>
                                <div class="chatbox-icons">
                                    <a href="javascript:void(0);"><i class="fa fa-minus"></i></a>
                                </div>
                            </div>
    
                            <div class="chat-messages">
                               
                         

                            </div>
    
                            <div class="chat-input-holder">
                                <button type="button" title="File Attachment" class="message-send fa fa-paperclip" onclick="document.getElementById('file-input').click()"></button>
                                <textarea id="chatmessage" class="chat-input" style="font-size: 20px;"></textarea>
                                <button type="button" value="Send" class="message-send" id="btnmessagesend">Send</button>
                            </div>
                            <div class="attachment-panel">
                                <input type="file" id="fileInput" style="display: none;" />
                            </div>
                        </div>
                    </div>
                `;
                console.log("Chatbox rendered.");
            }
        } else {
            alert('Div with class "csplguin-section" not found.');
        }
    } else {
        console.log("CSS link already exists, not appending again.");
    }




    

   

    // Check if the script is already in the document
    if (!document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"]')) {
        // Create the <script> element
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js";
        script.type = "text/javascript";

        // Find the div with id "csplugin"
        const cspluginDiv = document.getElementById("csplugin");
        if (cspluginDiv) {
            // Find the last script element in the div
            const existingScript = cspluginDiv.querySelector("script");

            // If there's already a script in the div, insert before it
            if (existingScript) {
                cspluginDiv.insertBefore(script, existingScript);
            } else {
                // If no script is found, just append it as the first child
                cspluginDiv.appendChild(script);
            }

            // Add onload event to ensure jQuery is loaded
            script.onload = function () {
                console.log("jQuery has been loaded dynamically in csplugin div.");

                // Now you can safely use jQuery
                $(function () {
                    // Get the chatbox state from sessionStorage or default to 'minimized' if not set
                    let chatboxState = sessionStorage.getItem("chatboxState") || "minimized";
                
                    //Load Message  when page load 
                     loadMessages();



                    // Apply the saved state (open or minimized)
                    if (chatboxState === "minimized") {
                        $(".chatbox").addClass("chatbox-min");
                    } else {
                        $(".chatbox").removeClass("chatbox-min");
                    }

                    // Toggle the minimize state when the minimize icon is clicked
                    $(".fa-minus, .chatbox-top").click(function (e) {
                        e.stopPropagation(); // Prevent other handlers from interfering
                        $(this).closest(".chatbox").toggleClass("chatbox-min");

                        // Save the current state in sessionStorage
                        if ($(this).closest(".chatbox").hasClass("chatbox-min")) {
                            sessionStorage.setItem("chatboxState", "minimized");
                            //alert("close");
                        } else {
                          //  alert("open");
                            sessionStorage.setItem("chatboxState", "open");
                        }

                        // Scroll to bottom after opening
                        scrollToBottom();
                    });

                    // Scroll to bottom function
                    function scrollToBottom() {
                        const chatMessages = document.getElementsByClassName("chat-messages")[0];
                        if (chatMessages) {
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }
                    }

                    // Initial scroll to bottom (if needed when opened)
                    if (chatboxState !== "minimized") {
                        scrollToBottom();
                    }

                    // Handle page close/unload event
                    $(window).on("beforeunload", function () {
                        const isMinimized = $(".chatbox").hasClass("chatbox-min");
                        if (isMinimized) {
                            sessionStorage.setItem("chatboxState", "minimized");
                        } else {
                            sessionStorage.setItem("chatboxState", "open");
                        }
                    });


                 
/*------------------------------ END AUTH AND ROOM CREATION --------------------------------------*/
                  auth();
                  function auth() {
                        const logindata = {
                            ActionType: "AUTH",
                            Email: sessionStorage.getItem("LoginEmail"),
                            Password: sessionStorage.getItem("LoginPassword"),
                        };
                        $.ajax({
                            type: "POST",
                            async: true,
                            cache: false,
                            url: "https://bizportal.silaycity.gov.ph/spidc_web_api_test/api/v1/spidcproxy/chatSupportAppPostAuthenticateOAIMS",
                            data: JSON.stringify(logindata),
                            contentType: "application/json",
                            beforeSend: function (xhr) {
                                 xhr.setRequestHeader("Authorization", "lfFaeXGggldqkXBhuuwxReKpozqCBtjynxyf608Xb7vGS09FsMNTXdsjViiYA8j2");
                            },
                            success: function (response) {
                                    const userData = response; // No need for JSON.parse(JSON.stringify) if response is already an object
                                    if (userData && userData.data && userData.data[0]) {
                                        const user = userData.data[0];
                                        
                                        // Set sessionStorage items if data exists
                                        sessionStorage.setItem('SS1000UID', user.IDNo);
                                        sessionStorage.setItem('SS1000UT', user.UserType);
                                        sessionStorage.setItem('SS1000FN', user.FirstName);
                                        sessionStorage.setItem('SS1000LN', user.LastName);
                                        sessionStorage.setItem('SS1000G', user.SetupGender);
                                      
                                        // Proceed with RoomCreation
                                        RoomCreation();
                                    } else {
                                        console.log("Unexpected response format or missing data properties.");
                                    }
                              
                            },
                            error: function (xhr, status, errorThrown) {
                                // HANDLES ERROR REPONSE
                                //console.log(xhr.status); // Log the HTTP status code (e.g., 500)
                                console.log(xhr.responseText); // Log the response text received from the server
                                //console.log(errorThrown);
                            },
                        });
                    }


                      function RoomCreation() {
                             //alert('Button clicked!');
                             const roomdata = {
                                 ActionType: "Create Chat Support",
                                 CMSGID: null,
                                 UID: sessionStorage.getItem("SS1000UID"),
                             };
                             $.ajax({
                                 type: "POST",
                                 async: true,
                                 cache: false,
                                 url: "https://bizportal.silaycity.gov.ph/spidc_web_api_test/api/v1/spidcproxy/chatSupportAppPostOAIMS",
                                 data: JSON.stringify(roomdata),
                                 contentType: "application/json",
                                 beforeSend: function (xhr) {
                                       xhr.setRequestHeader("Authorization", "lfFaeXGggldqkXBhuuwxReKpozqCBtjynxyf608Xb7vGS09FsMNTXdsjViiYA8j2");
                                 },
                                 success: function (response) {
                                     console.log(response);
                                     console.log(response.data);
                                     sessionStorage.setItem("SSUCID", response.data);
                                      // Set other session data
                                      sessionStorage.setItem('SSUCSWA', '1');
                                     //csconvo(sessionStorage.getItem('SSUCID'));
                                     //csconvo();
                                 },
                                 error: function (xhr, status, errorThrown) {
                                     // HANDLES ERROR REPONSE
                                     //console.log(xhr.status); // Log the HTTP status code (e.g., 500)
                                     console.log(xhr.responseText); // Log the response text received from the server
                                     //console.log(errorThrown);
                                 },
                             });
                         }
                    /*------------------------------ END AUTH AND ROOM CREATION --------------------------------------*/



                 
                   
                  
                    /*------------------------------ END LOAD CONCVO--------------------------------------*/
                    loadrealtimeconvo()
                     function loadrealtimeconvo() {
                        // Call csconvo immediately, then start polling every 2 seconds
                        // csconvo(); // Initial call to fetch the chat immediately

                        // Set an interval to call csconvo every 2 seconds
                        setInterval(() => {
                            //csconvo();
                            //alert("test");
                            // Check if the session storage value 'SSUCSWA' is equal to "1"
                            // if (sessionStorage.getItem("SSUCSWA") === "1") {
                            //     // Call the csconvo function if the condition is met
                            //     csconvo();
                            //     csconvoClientMessageUnsendUpdating();
                            // } else {
                            //     //Do Nothing
                            // }
                            csconvo();
                            csconvoClientMessageUnsendUpdating();
                            //alert("test");
                        }, 2000); // Adjust the interval as needed (2000 milliseconds = 2 seconds)
                    }
                  /* ------------------------------ END LOAD CONCVO--------------------------------------*/


                  
                  
                    /* ------------------------------ END CONVO--------------------------------------*/
                    var SS1000UID = "20241205000001"
                    let processedMessageIds = JSON.parse(sessionStorage.getItem("processedMessageIds")) || [];
                    function csconvo() {
                        
                        $.ajax({
                            url: "https://bizportal.silaycity.gov.ph/spidc_web_api_test/api/v1/spidcproxy/chatSupportAppGetOAIMS/" + SS1000UID,
                            type: "GET",
                            dataType: "json",
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader("Authorization", "lfFaeXGggldqkXBhuuwxReKpozqCBtjynxyf608Xb7vGS09FsMNTXdsjViiYA8j2");
                            },
                            success: function (response) {
                                // Remove any temporary loading message or last placeholder
                                //$('.chat-messages').children('.message-box-holder').last().remove();
                                //removeConnectingMessages();

                                if (response && response.data && response.data.ChatSpecificInformation) {
                                    const chatData = response.data.ChatSpecificInformation;

                                    chatData.forEach((chat) => {
                                        // Check if this message ID has already been processed
                                        if (!processedMessageIds.includes(chat.message_id)) {
                                            const messageClass = chat.sender_id === SS1000UID ? "message-box" : "bot-box";
                                            let chatMessage = "";

                                            // Check for any message text or file attachment
                                            if (chat.message !== "" || chat.file_path !== "") {
                                                const csactionbtn = chat.sender_id === SS1000UID ? "" : "";
                                                chatMessage = csactionbtn + '<div class="message-box-holder newtooltip">\n' + '<div class="' + messageClass + '">\n';

                                                // Append the message text if it exists
                                                if (chat.message !== "") {
                                                    chatMessage += '<p style="margin-bottom: 0px;">' + chat.message + "</p>\n";
                                                }

                                                // Append the file if it exists and handle file types
                                                if (chat.file_path !== "") {
                                                    let fileElement = "";
                                                    if (chat.file_type === "image/jpeg" || chat.file_type === "image/png") {
                                                        fileElement = `<img src="${"https://bizportal.silaycity.gov.ph/spidc_web_api_test/CSPluginServer" + chat.file_path}" alt="Attachment" onclick="viewFullScreen('${
                                                            "https://bizportal.silaycity.gov.ph/spidc_web_api/CSPluginServer" + chat.file_path
                                                        }')" style="cursor: pointer;width: 100%;height: 100px;">`;
                                                    } else if (chat.file_type === "video/mp4") {
                                                        fileElement = `<video controls><source src="${chat.file_path}" type="video/mp4"></video>`;
                                                    } else if (chat.file_type === "application/pdf") {
                                                        if (messageClass === "message-box") {
                                                            fileElement = `<a href="${"https://bizportal.silaycity.gov.ph/spidc_web_api_test/CSPluginServer" + chat.file_path}" download="${chat.file_path
                                                                .split("/")
                                                                .pop()}" style="color: white;">${chat.file_path.split("/").pop()}</a>`;
                                                        } else {
                                                            fileElement = `<a href="${"https://bizportal.silaycity.gov.ph/spidc_web_api_test/CSPluginServer" + chat.file_path}" download="${chat.file_path
                                                                .split("/")
                                                                .pop()}" style="color: #716060;">${chat.file_path.split("/").pop()}</a>`;
                                                        }
                                                    }

                                                    chatMessage += '<div style="margin-top: 0px;">' + fileElement + "</div>\n";
                                                }
                                                let cstimepostion = "cstimeposition";
                                                let chatMessageToolTip = "";
                                                if (messageClass === "message-box") {
                                                    cstimepostion = "";
                                                    chatMessageToolTip = '<span class="newtooltip-text csthaction" data-id="' + chat.message_id + '"><i class="fa fa-trash csicon" aria-hidden="true"></i> Unsend</span>';
                                                } else {
                                                    cstimepostion = "cstimeposition";
                                                    chatMessageToolTip = '<span class="csthaction" data-id="' + chat.message_id + '"></span>';
                                                }

                                                chatMessage +=
                                                    "</div>\n" + // Close message-box or bot-box
                                                    "" +
                                                    chatMessageToolTip +
                                                    "\n" +
                                                    '<span class="' +
                                                    cstimepostion +
                                                    '">' +
                                                    timeAgo(chat.sent_at) +
                                                    "</span>\n" +
                                                    "</div>"; // Close message-box-holder

                                                // +'<span>' + timeAgo(chat.sent_at) + '</span>\n'

                                                // Append to chat container
                                                $(".chat-messages").append(chatMessage);

                                                // Scroll to the bottom after showing new response
                                                scrollToBottom();
                                            }

                                            // Store this message ID in the processedMessageIds array
                                            processedMessageIds.push(chat.message_id);
                                            // Save the updated processedMessageIds to sessionStorage
                                            sessionStorage.setItem("processedMessageIds", JSON.stringify(processedMessageIds));
                                            // Save messages to local storage
                                            saveMessages();
                                        }
                                    });
                                } else {
                                    console.error("Unexpected response structure:", response);
                                }
                            },
                            error: function (xhr, status, errorThrown) {
                                console.log("Error fetching chat convo:", xhr.responseText);
                            },
                        });
                    }

                    /* ------------------------------ END CONVO--------------------------------------*/

                    /* ------------------------------ END CLIENT MESSAGE UNSEND UPDATING-------------------------------------*/
                    function csconvoClientMessageUnsendUpdating() {
                                        $.ajax({
                                            url: "https://bizportal.silaycity.gov.ph/spidc_web_api_test/api/v1/spidcproxy/chatSupportAppGetOAIMS/" + SS1000UID,
                                            type: "GET",
                                            dataType: "json",
                                            beforeSend: function (xhr) {
                                                xhr.setRequestHeader("Authorization", "lfFaeXGggldqkXBhuuwxReKpozqCBtjynxyf608Xb7vGS09FsMNTXdsjViiYA8j2");
                                            },
                                            success: function (response) {
                                                const chatData = response.data.ChatSpecificInformation;
                                                const filteredChatData = response.data.ChatSpecificInformation.filter(function (chat) {
                                                    return chat.sender_id !== SS1000UID;
                                                });

                                                const filteredChatDataClentMsg = response.data.ChatSpecificInformation.filter(function (chat) {
                                                    return chat.sender_id == SS1000UID;
                                                });

                                                filteredChatData.forEach((chat) => {
                                                    //console.log(chat.message_id+" "+chat.message);
                                                    if (chat.message == "Message Unsend" && chat.file_path == "") {
                                                        //console.log("True");
                                                        //Final Working For ALL
                                                        let chatMessages = sessionStorage.getItem("chatMessages");
                                                        // Define the target data-id and the new content
                                                        const targetId = chat.message_id; // Change this to the desired data-id
                                                        const newContent = '<p style="margin-bottom: 0px;">Message Unsend</p>'; // New content to replace with
                                                        // Create regex to find the message box containing a <p>
                                                        const pRegex = new RegExp(`(<div class="bot-box">\\s*<p style="margin-bottom: 0px;">)(.*?)(</p>\\s*</div>\\s*<span class="csthaction" data-id="${targetId}".*?>)`, "i");
                                                        // Create regex to find the message box containing an <img>
                                                        const imageRegex = new RegExp(`(<div class="bot-box">)(\\s*(<div style="margin-top: 0px;">\\s*<img[^>]*>\\s*</div>))(\\s*</div>\\s*<span class="csthaction" data-id="${targetId}".*?>)`, "i");
                                                        // Create regex to find the message box containing an <a>
                                                        const linkRegex = new RegExp(`(<div class="bot-box">)(\\s*(<div style="margin-top: 0px;">\\s*<a[^>]*>.*?</a>\\s*</div>))(\\s*</div>\\s*<span class="csthaction" data-id="${targetId}".*?>)`, "i");
                                                        // Replace the content of the target <p> tag
                                                        chatMessages = chatMessages.replace(pRegex, `$1${newContent}$3`);
                                                        // Replace the content of the target <img> with the new content
                                                        chatMessages = chatMessages.replace(imageRegex, `$1${newContent}$4`);
                                                        // Replace the content of the target <a> with the new content
                                                        chatMessages = chatMessages.replace(linkRegex, `$1${newContent}$4`);
                                                        // Save the updated HTML string back to sessionStorage
                                                        // sessionStorage.setItem('chatMessages', chatMessages);
                                                        //remove timne pattern
                                                        const pattern = `<span class="csthaction" data-id="${targetId}"><\/span>\\s*<span class="cstimeposition">.*?<\/span>`;
                                                        // Use a regular expression with 's' flag for multiline matching
                                                        chatMessages = chatMessages.replace(new RegExp(pattern, "s"), "");
                                                        sessionStorage.setItem("chatMessages", chatMessages);
                                                    } else if (chat.file_path == "Message Unsend" && chat.message == "") {
                                                        //Final Working For ALL
                                                        let chatMessages = sessionStorage.getItem("chatMessages");
                                                        // Define the target data-id and the new content
                                                        const targetId = chat.message_id; // Change this to the desired data-id
                                                        const newContent = '<p style="margin-bottom: 0px;">Message Unsend</p>'; // New content to replace with
                                                        // Create regex to find the message box containing a <p>
                                                        const pRegex = new RegExp(`(<div class="bot-box">\\s*<p style="margin-bottom: 0px;">)(.*?)(</p>\\s*</div>\\s*<span class="csthaction" data-id="${targetId}".*?>)`, "i");
                                                        // Create regex to find the message box containing an <img>
                                                        const imageRegex = new RegExp(`(<div class="bot-box">)(\\s*(<div style="margin-top: 0px;">\\s*<img[^>]*>\\s*</div>))(\\s*</div>\\s*<span class="csthaction" data-id="${targetId}".*?>)`, "i");
                                                        // Create regex to find the message box containing an <a>
                                                        const linkRegex = new RegExp(`(<div class="bot-box">)(\\s*(<div style="margin-top: 0px;">\\s*<a[^>]*>.*?</a>\\s*</div>))(\\s*</div>\\s*<span class="csthaction" data-id="${targetId}".*?>)`, "i");
                                                        // Replace the content of the target <p> tag
                                                        chatMessages = chatMessages.replace(pRegex, `$1${newContent}$3`);
                                                        // Replace the content of the target <img> with the new content
                                                        chatMessages = chatMessages.replace(imageRegex, `$1${newContent}$4`);
                                                        // Replace the content of the target <a> with the new content
                                                        chatMessages = chatMessages.replace(linkRegex, `$1${newContent}$4`);
                                                        // Save the updated HTML string back to sessionStorage
                                                        // sessionStorage.setItem('chatMessages', chatMessages);
                                                        const pattern = `<span class="csthaction" data-id="${targetId}"><\/span>\\s*<span class="cstimeposition">.*?<\/span>`;
                                                        // Use a regular expression with 's' flag for multiline matching
                                                        chatMessages = chatMessages.replace(new RegExp(pattern, "s"), "");
                                                        sessionStorage.setItem("chatMessages", chatMessages);
                                                    } else {
                                                        //for all timesent
                                                        let chatMessages = sessionStorage.getItem("chatMessages");
                                                        const targetId = chat.message_id; // Change this to the desired data-id

                                                        // Pattern 1: For the span with both 'newtooltip-text csthaction' classes and inner content for "just now"
                                                        const pattern1 = new RegExp(`<span class="newtooltip-text csthaction" data-id="${targetId}">.*?<\\/span>\\s*<span class="">.*?<\\/span>`, "s");

                                                        // Pattern 2: For the simpler span structure with class 'cstimeposition' containing "just now"
                                                        const pattern2 = new RegExp(`<span class="csthaction" data-id="${targetId}"><\\/span>\\s*<span class="cstimeposition">.*?<\\/span>`, "s");

                                                        // Replace "just now" text in both patterns with "Updated Time"
                                                        chatMessages = chatMessages.replace(pattern1, (match) => {
                                                            // This will replace the 'just now' text in the second span with 'Updated Time'
                                                            return match.replace(/<span class="">.*?<\/span>/, '<span class="">' + timeAgo(chat.sent_at) + "</span>");
                                                        });

                                                        chatMessages = chatMessages.replace(pattern2, (match) => {
                                                            // This will replace 'just now' with 'Updated Time' in the second span
                                                            return match.replace(/<span class="cstimeposition">.*?<\/span>/, '<span class="cstimeposition">' + timeAgo(chat.sent_at) + "</span>");
                                                        });

                                                        // Log the modified chatMessages to confirm the update
                                                        //  console.log(targetId);
                                                        //console.log(chatMessages);
                                                        sessionStorage.setItem("chatMessages", chatMessages);
                                                    }
                                                });

                                                filteredChatDataClentMsg.forEach((chat) => {
                                                    //console.log(chat.message_id+" "+chat.message);
                                                    if (chat.message == "Message Unsend" && chat.file_path == "") {
                                                        //console.log("True");
                                                        //Final Working For ALL
                                                        let chatMessages = sessionStorage.getItem("chatMessages");
                                                        // Define the target data-id and the new content
                                                        const targetId = chat.message_id; // Change this to the desired data-id
                                                        const newContent = '<p style="margin-bottom: 0px;">Message Unsend</p>'; // New content to replace with
                                                        // Create regex to find the message box containing a <p>
                                                        const pRegex = new RegExp(`(<div class="message-box">\\s*<p style="margin-bottom: 0px;">)(.*?)(</p>\\s*</div>\\s*<span class="newtooltip-text csthaction" data-id="${targetId}".*?>)`, "i");
                                                        // Create regex to find the message box containing an <img>
                                                        const imageRegex = new RegExp(
                                                            `(<div class="message-box">)(\\s*(<div style="margin-top: 0px;">\\s*<img[^>]*>\\s*</div>))(\\s*</div>\\s*<span class="newtooltip-text csthaction" data-id="${targetId}".*?>)`,
                                                            "i"
                                                        );
                                                        // Create regex to find the message box containing an <a>
                                                        const linkRegex = new RegExp(
                                                            `(<div class="message-box">)(\\s*(<div style="margin-top: 0px;">\\s*<a[^>]*>.*?</a>\\s*</div>))(\\s*</div>\\s*<span class="newtooltip-text csthaction" data-id="${targetId}".*?>)`,
                                                            "i"
                                                        );
                                                        // Replace the content of the target <p> tag
                                                        chatMessages = chatMessages.replace(pRegex, `$1${newContent}$3`);
                                                        // Replace the content of the target <img> with the new content
                                                        chatMessages = chatMessages.replace(imageRegex, `$1${newContent}$4`);
                                                        // Replace the content of the target <a> with the new content
                                                        chatMessages = chatMessages.replace(linkRegex, `$1${newContent}$4`);
                                                        // Save the updated HTML string back to sessionStorage
                                                        // sessionStorage.setItem('chatMessages', chatMessages);
                                                        const pattern = `<span class="newtooltip-text csthaction" data-id="${targetId}">.*?<\/span>\\s*<span class="">.*?<\/span>`;
                                                        // Use a regular expression with 's' flag for multiline matching
                                                        chatMessages = chatMessages.replace(new RegExp(pattern, "s"), "");
                                                        sessionStorage.setItem("chatMessages", chatMessages);
                                                    } else if (chat.file_path == "Message Unsend" && chat.message == "") {
                                                        //Final Working For ALL
                                                        let chatMessages = sessionStorage.getItem("chatMessages");
                                                        // Define the target data-id and the new content
                                                        const targetId = chat.message_id; // Change this to the desired data-id
                                                        const newContent = '<p style="margin-bottom: 0px;">Message Unsend</p>'; // New content to replace with
                                                        // Create regex to find the message box containing a <p>
                                                        const pRegex = new RegExp(`(<div class="message-box">\\s*<p style="margin-bottom: 0px;">)(.*?)(</p>\\s*</div>\\s*<span class="newtooltip-text csthaction" data-id="${targetId}".*?>)`, "i");
                                                        // Create regex to find the message box containing an <img>
                                                        const imageRegex = new RegExp(
                                                            `(<div class="message-box">)(\\s*(<div style="margin-top: 0px;">\\s*<img[^>]*>\\s*</div>))(\\s*</div>\\s*<span class="newtooltip-text csthaction" data-id="${targetId}".*?>)`,
                                                            "i"
                                                        );
                                                        // Create regex to find the message box containing an <a>
                                                        const linkRegex = new RegExp(
                                                            `(<div class="message-box">)(\\s*(<div style="margin-top: 0px;">\\s*<a[^>]*>.*?</a>\\s*</div>))(\\s*</div>\\s*<span class="newtooltip-text csthaction" data-id="${targetId}".*?>)`,
                                                            "i"
                                                        );
                                                        // Replace the content of the target <p> tag
                                                        chatMessages = chatMessages.replace(pRegex, `$1${newContent}$3`);
                                                        // Replace the content of the target <img> with the new content
                                                        chatMessages = chatMessages.replace(imageRegex, `$1${newContent}$4`);
                                                        // Replace the content of the target <a> with the new content
                                                        chatMessages = chatMessages.replace(linkRegex, `$1${newContent}$4`);
                                                        // Save the updated HTML string back to sessionStorage
                                                        // sessionStorage.setItem('chatMessages', chatMessages);
                                                        const pattern = `<span class="newtooltip-text csthaction" data-id="${targetId}">.*?<\/span>\\s*<span class="">.*?<\/span>`;
                                                        // Use a regular expression with 's' flag for multiline matching
                                                        chatMessages = chatMessages.replace(new RegExp(pattern, "s"), "");
                                                        sessionStorage.setItem("chatMessages", chatMessages);
                                                    } else {
                                                        //for all timesent
                                                        let chatMessages = sessionStorage.getItem("chatMessages");
                                                        const targetId = chat.message_id; // Change this to the desired data-id

                                                        // Pattern 1: For the span with both 'newtooltip-text csthaction' classes and inner content for "just now"
                                                        const pattern1 = new RegExp(`<span class="newtooltip-text csthaction" data-id="${targetId}">.*?<\\/span>\\s*<span class="">.*?<\\/span>`, "s");

                                                        // Pattern 2: For the simpler span structure with class 'cstimeposition' containing "just now"
                                                        const pattern2 = new RegExp(`<span class="csthaction" data-id="${targetId}"><\\/span>\\s*<span class="cstimeposition">.*?<\\/span>`, "s");

                                                        // Replace "just now" text in both patterns with "Updated Time"
                                                        chatMessages = chatMessages.replace(pattern1, (match) => {
                                                            // This will replace the 'just now' text in the second span with 'Updated Time'
                                                            return match.replace(/<span class="">.*?<\/span>/, '<span class="">' + timeAgo(chat.sent_at) + "</span>");
                                                        });

                                                        chatMessages = chatMessages.replace(pattern2, (match) => {
                                                            // This will replace 'just now' with 'Updated Time' in the second span
                                                            return match.replace(/<span class="cstimeposition">.*?<\/span>/, '<span class="cstimeposition">' + timeAgo(chat.sent_at) + "</span>");
                                                        });

                                                        // Log the modified chatMessages to confirm the update
                                                        //console.log("Client Message"+" "+targetId);
                                                        //console.log(chatMessages);
                                                        sessionStorage.setItem("chatMessages", chatMessages);
                                                    }
                                                });

                                                loadMessages();
                                            },
                                            error: function (xhr, status, errorThrown) {
                                                console.log("Error fetching chat convo:", xhr.responseText);
                                            },
                                        });
                                    }
               /* ------------------------------ END CLIENT MESSAGE UNSEND UPDATING-------------------------------------*/




                 /* ------------------------------  SEND CHAT -------------------------------------*/
                      $("#btnmessagesend").click(function () {
                        sendChat();
                    });

                    document.addEventListener("keydown", function (event) {
                        if (event.key === "Enter") {
                            // Check if the pressed key is Enter
                            sendChat(); // Call the same function
                        }
                    });
                     function sendChat() {
                        if (document.getElementById("chatmessage").value.trim() == "" && fileInput.files.length === 0) {
                        } else {
                            const file = fileInput.files[0];
                            var message = document.getElementById("chatmessage").value.trim();
                            const uID = SS1000UID;
                            const cID = SS1000UID;
                           uploadFile(file, message, uID, cID);
                            //alert(uID+" "+cID);
                            document.getElementById("fileInput").value = "";
                            document.getElementById("chatmessage").value = "";

                        }
                    }
                 
                      function uploadFile(file, message, uID, cID) {
                        //if (!file) {
                        // If there is no file, handle it as needed
                        $.ajax({
                            type: "POST",
                            url: "/spidc_web_api_test/CSPluginServer/ChatSupport.aspx/SaveFile",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ fileName: null, fileData: null, fileType: null, message: message, uID: uID, cID: cID }),
                            success: function (response) {
                               // console.log(response.d);
                                //  csconvo(sessionStorage.getItem('activeChatItem'));
                                $("#fileInput").val("");
                            },
                            error: function (xhr, status, error) {
                                console.log(xhr.responseText);
                                alert("Error: " + xhr.responseText); // Show detailed error
                            },
                        });
                        return; // Exit the function early
                    }


                        /* Input File Data Checker */
                    const fileInput = document.getElementById("fileInput");
                    fileInput.addEventListener("change", () => {
                        const file = fileInput.files[0];
                        if (file) {
                            const reader = new FileReader();

                            reader.onload = (e) => {
                                // At this point, the file is read into memory.
                                // You can now check the file type directly from the File object
                                if (file.type.startsWith("video/")) {
                                    alert("Video files are not allowed");
                                } else {
                                    //alert('File is OK');
                                }
                            };
                            // Start reading the file as a data URL (base64 encoded string)
                            reader.readAsDataURL(file);
                        } else {
                            alert("No file selected");
                        }
                    });
                    /*end Input File Data Checker */






                /* ------------------------------ END SEND CHAT -------------------------------------*/





                        /* ------------------------------ UNSEND MESSAGE -------------------------------------*/

                                  $(document).on("click", ".csthaction", function () {
                                                // Save the active item's data-id in localStorage
                                                const mgsid = $(this).data("id");
                                                const csdsuID = SS1000UID;
                                                const sdsdscID = SS1000UID;
                                                // csconvo(csdsuID,sdsdscID);
                                                //scrollToBottom();
                                                 //alert(mgsid);
                                                csunsendmessage(mgsid, sdsdscID);
                                                //csconvoClientMessageUnsendUpdating();
                                     });


                                    function csunsendmessage(dfdf, dsfsdf) {
                                        const dsfsdfsdf = {
                                            ActionType: "Unsend Message",
                                            UID: null,
                                            CMSGID: dfdf,
                                        };
                                        $.ajax({
                                            type: "POST",
                                            async: true,
                                            cache: false,
                                            url: "https://bizportal.silaycity.gov.ph/spidc_web_api_test/api/v1/spidcproxy/chatSupportAppPostOAIMS",
                                            data: JSON.stringify(dsfsdfsdf),
                                            contentType: "application/json",
                                            beforeSend: function (xhr) {
                                                xhr.setRequestHeader("Authorization", "lfFaeXGggldqkXBhuuwxReKpozqCBtjynxyf608Xb7vGS09FsMNTXdsjViiYA8j2");
                                            },
                                            success: function (response) {
                                                console.log(response);

                                                //Final Working For ALL
                                                let chatMessages = sessionStorage.getItem("chatMessages");
                                                // Define the target data-id and the new content
                                                const targetId = dfdf; // Change this to the desired data-id
                                                const newContent = '<p style="margin-bottom: 0px;">Message Unsend</p>'; // New content to replace with
                                                // Create regex to find the message box containing a <p>
                                                const pRegex = new RegExp(`(<div class="message-box">\\s*<p style="margin-bottom: 0px;">)(.*?)(</p>\\s*</div>\\s*<span class="newtooltip-text csthaction" data-id="${targetId}".*?>)`, "i");
                                                // Create regex to find the message box containing an <img>
                                                const imageRegex = new RegExp(
                                                    `(<div class="message-box">)(\\s*(<div style="margin-top: 0px;">\\s*<img[^>]*>\\s*</div>))(\\s*</div>\\s*<span class="newtooltip-text csthaction" data-id="${targetId}".*?>)`,
                                                    "i"
                                                );
                                                // Create regex to find the message box containing an <a>
                                                const linkRegex = new RegExp(
                                                    `(<div class="message-box">)(\\s*(<div style="margin-top: 0px;">\\s*<a[^>]*>.*?</a>\\s*</div>))(\\s*</div>\\s*<span class="newtooltip-text csthaction" data-id="${targetId}".*?>)`,
                                                    "i"
                                                );
                                                // Replace the content of the target <p> tag
                                                chatMessages = chatMessages.replace(pRegex, `$1${newContent}$3`);
                                                // Replace the content of the target <img> with the new content
                                                chatMessages = chatMessages.replace(imageRegex, `$1${newContent}$4`);
                                                // Replace the content of the target <a> with the new content
                                                chatMessages = chatMessages.replace(linkRegex, `$1${newContent}$4`);
                                                // Save the updated HTML string back to sessionStorage
                                                sessionStorage.setItem("chatMessages", chatMessages);
                                                // loadMessages();
                                                //remove timne pattern
                                                const pattern = `<span class="newtooltip-text csthaction" data-id="${targetId}">.*?<\/span>\\s*<span class="">.*?<\/span>`;
                                                // Use a regular expression with 's' flag for multiline matching
                                                chatMessages = chatMessages.replace(new RegExp(pattern, "s"), "");
                                                sessionStorage.setItem("chatMessages", chatMessages);

                                                // console.log(chatMessages);
                                            },
                                            error: function (xhr, status, errorThrown) {
                                                console.log(xhr.responseText); // Log the response text received from the server
                                            },
                                        });
                                    }
                        /* ------------------------------ END UNSEND MESSAGE-------------------------------------*/


                    







                    /* ------------------------------ chat timestamp--------------------------------------*/
                    function timeAgo(dateString) {
                        const now = new Date();
                        const then = new Date(dateString);
                        const diff = now - then;

                        if (diff < 1000) {
                            return "just now"; // Show "just now" for times under 1 second
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
                    /*------------------------- end chat timestamp---------------------------*/

 
                /* ------------------------------ Save messages to local storage --------------------------------------*/
                    function saveMessages() {
                        const messages = $(".chat-messages").html();
                        sessionStorage.setItem("chatMessages", messages);
                    }
                /* ------------------------------ END Save messages to local storage --------------------------------------*/

              /* ------------------------------ Load messages from local storage --------------------------------------*/
                     function loadMessages() {
                        const savedMessages = sessionStorage.getItem("chatMessages");
                        if (savedMessages) {
                            $(".chat-messages").html(savedMessages);
                            scrollToBottom(); 
                        }
                    }
                    /* ------------------------------ End Load messages from local storage --------------------------------------*/

               /* ------------------------------ Function to remove specific bot messages--------------------------------------*/
                    function removeConnectingMessages() {
                        // Remove the "Connecting to Agent......." message
                        $(".message-box-holder")
                            .filter(function () {
                                return $(this).find(".bot-box").text().trim() === "Connecting to Agent.......";
                            })
                            .remove();

                        // Remove any empty bot boxes
                        $(".message-box-holder").filter(function () {
                                return $(this).find(".bot-box").is(":empty"); // Check if the bot box is empty
                            }).remove();
                    }
               /* ------------------------------ END Function to remove specific bot messages--------------------------------------*/
                  
                   

                   

                  

                   
                    
                  

                   
                    
               
                  
                });
                //end of document ready
            };

            // Optionally, add error handling in case the script fails to load
            script.onerror = function () {
                console.error("Failed to load jQuery from CDN.");
            };
        } else {
            alert('Div with id "csplugin" not found.');
        }
    } else {
        alert("jQuery script already exists, not appending again.");
    }



    
}


function viewFullScreen(src) {
    const fullScreenContainer = document.createElement("div");
    fullScreenContainer.style.position = "fixed";
    fullScreenContainer.style.top = "0";
    fullScreenContainer.style.left = "0";
    fullScreenContainer.style.width = "100%";
    fullScreenContainer.style.height = "100%";
    fullScreenContainer.style.backgroundColor = "rgba(0,0,0,0.8";
    fullScreenContainer.style.display = "flex";
    fullScreenContainer.style.alignItems = "center";
    fullScreenContainer.style.justifyContent = "center";
    fullScreenContainer.style.zIndex = "1000";
    fullScreenContainer.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    fullScreenContainer.appendChild(img);

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "20px";
    closeButton.style.right = "20px";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.padding = "10px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = () => document.body.removeChild(fullScreenContainer);
    fullScreenContainer.appendChild(closeButton);

    fullScreenContainer.onclick = () => document.body.removeChild(fullScreenContainer);

    document.body.appendChild(fullScreenContainer);

    document.addEventListener("keydown", function handleEscKey(e) {
        if (e.key === "Escape") {
            document.body.removeChild(fullScreenContainer);
            document.removeEventListener("keydown", handleEscKey);
        }
    });
}
