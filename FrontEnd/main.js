// var promise = import("string.js");
function submitSearch(e) {
    console.log(document.getElementById("input-search").value);
    var apigClient = apigClientFactory.newClient();

    var params = {
        'q': document.getElementById("input-search").value,
    };

    apigClient.searchGet(params, {}, {})
        .then(function (result) {
            console.log("result",result);
            img_paths = result["data"]["body"]["imagePaths"];
            console.log("image_paths", img_paths)
            //console.log(img_paths.substring(1,img_paths.length-1))  
            // result["data"]["body"]["imagePaths"][0]
            
            var div = document.getElementById("imgDiv");
            div.innerHTML = "";

            var j;
            for(j = 0; j < img_paths.length; j++) {
                img_ls = img_paths[j].split('/');
                img_name = img_ls[img_ls.length-1];
                div.innerHTML += '<figure><img src="' + img_paths[j] + 
                    '" style="width:25%"><figcaption>' 
                    + img_name + '</figcaption></figure>';
            }
        }).catch(function (result) {
            console.log(result);
        });
}


function submitVoice(file) {

    console.log(file);
    console.log(file.type)
    var file_name = "Recording.wav";

    var apigClient = apigClientFactory.newClient();

    var additionalParams = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
            'Content-Type': file.type,
            // 'X-Api-Key': 'VF4Y2lXaWy7EvtuTZrrCW8R7UoNgUx2SzpcDFkQ4',
            'timeout': 600000
        }
    }
    // https://cors-anywhere.herokuapp.com/https://dzwptd01uf.execute-api.us-east-1.amazonaws.com/gamma/photos/hw3-photos-bucket-b2/ 
    var url = "https://cors-anywhere.herokuapp.com/https://af1rese0zd.execute-api.us-east-1.amazonaws.com/dev/upload/awstranscribe-recordings/" + file_name
    axios.put(url, file, additionalParams).then(function(response) {

        var params = {
            'q': 'searchAudio',
        };
        // https://cors-anywhere.herokuapp.com/https://dzwptd01uf.execute-api.us-east-1.amazonaws.com/gamma/search
        // var get_url = "https://cors-anywhere.herokuapp.com/https://af1rese0zd.execute-api.us-east-1.amazonaws.com/dev/search";
        

        apigClient.searchGet(params, {}, {'timeout': 600000}).then(function (result) {
                checkResponse(result);
            }).catch(function (result) {
                console.log('wait... still searching')
            });

        console.log("Audio file uploaded: " + file_name);
               
    }).catch(function (result) {
        console.log("Errorrrrrrr", result);
    });

    setTimeout(function() { 
        console.log('wait...')
    }, 60000);

    setTimeout(function() { 
        params = {
             'q': 'getAudio',
        }
        apigClient.searchGet(params, {}, {'timeout': 600000}).then(function (result) {
                console.log("checkresponse result",result)
                checkResponse(result);
                alert('Search successful!');
            }).catch(function (result) {
                alert("No photos found for your search. Can you repeat?")
                console.log('Get Error:1', result);
            }); 
    }, 60000);

}

function checkResponse(result) {
    console.log(result);
    if (result["data"]) {
        img_paths = result["data"]["body"]["imagePaths"];
        var div = document.getElementById("imgDiv");
        div.innerHTML = "";

        var j;
        for(j = 0; j < img_paths.length; j++) {
            img_ls = img_paths[j].split('/');
            img_name = img_ls[img_ls.length-1];
            div.innerHTML += '<figure><img src="' + img_paths[j] + 
                '" style="width:25%"><figcaption>' + img_name + '</figcaption></figure>';
        }
    }
}


function submitPhoto(e) {

    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }

    var path = (document.getElementById("input-file").value).split("\\");
    var file_name = path[path.length-1];

    console.log(file_name);

    var file = document.getElementById("input-file").files[0];
    console.log(file);

    const reader = new FileReader();

    var apigClient = apigClientFactory.newClient();
    var params = {};

    var additionalParams = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': file.type
            // 'X-Api-Key': 'VF4Y2lXaWy7EvtuTZrrCW8R7UoNgUx2SzpcDFkQ4'
        }
    }

// apigClient.uploadBucketKeyPut(params, {}, additionalParams).then(function(res){
//     console.log("res status", res.status)
//     if (res.status == 200)
//        {
//         alert("Image uploaded: " + file.name);
//        }
// }).catch(function (res) {
//     console.log(res);
// });

    url = "https://cors-anywhere.herokuapp.com/https://af1rese0zd.execute-api.us-east-1.amazonaws.com/dev/upload/bucketa3/" + file.name
    axios.put(url, file, additionalParams).then(response => {
        alert("Image uploaded: " + file.name);
    });
    
}


function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // reader.onload = () => resolve(reader.result)
      reader.onload = () => {
        let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  }

/* This function is for uploading a file */
function myFunction() {
    var x = document.getElementById("input-file");
    var txt = "";
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "Select one or more files.";
        } else {
            for (var i = 0; i < x.files.length; i++) {
                txt += "<br><strong>" + (i + 1) + ". file</strong><br>";
                var file = x.files[i];
                if ('name' in file) {
                    txt += "name: " + file.name + "<br>";
                }
                if ('size' in file) {
                    txt += "size: " + file.size + " bytes <br>";
                }
            }
        }
    } else {
        if (x.value == "") {
            txt += "Select one or more files.";
        } else {
            txt += "The files property is not supported by your browser!";
            txt += "<br>The path of the selected file: " + x.value;
        }
    }
    document.getElementById("demo").innerHTML = txt;
}