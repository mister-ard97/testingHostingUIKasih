  
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs');
const Axios = require('axios');
const URL_API = 'http://localhost:1998'

app.get('/', function(request, response) {
  console.log('Home page visited!');
  const filePath = path.resolve('./build', 'index.html');
  console.log(filePath)
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Kasih Nusantara');
    data = data.replace(/\$OG_DESCRIPTION/g, "Kasih Nusantara Website");
    result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
    response.send(result);
  });
});

app.get('/login', function(request, response) {

  const filePath = path.resolve(__dirname, './build', 'index.html')
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    // console.log(data)
    data = data.replace(/\$OG_TITLE/g, 'Login Page');
    data = data.replace(/\$OG_DESCRIPTION/g, "Login Page");
    result = data.replace(/\$OG_IMAGE/g, 'https://www.outbrain.com/techblog/wp-content/uploads/2017/05/road-sign-361513_960_720.jpg');
    response.send(result);
  });
});

app.get('/register', function(request, response) {
  console.log('Contact page visited!');
  const filePath = path.resolve(__dirname, './build', 'index.html')
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Register Page');
    data = data.replace(/\$OG_DESCRIPTION/g, "Register Page");
    result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
    response.send(result);
  });
});
app.get('/forgotPassword', function(request, response) {
  console.log('test page visited!');
  const filePath = path.resolve(__dirname, './build', 'index.html')
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Forgot Password');
    data = data.replace(/\$OG_DESCRIPTION/g, "Forgot Password");
    result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
    response.send(result);
  });
});

app.get('/verifiedReset', function(request, response) {
    console.log('test page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html')
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, 'Verified Reset');
      data = data.replace(/\$OG_DESCRIPTION/g, "Verified Reset");
      result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
      response.send(result);
    });
  });

  app.get('/waitingverification', function(request, response) {
    console.log('test page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html')
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, 'Waiting Verification');
      data = data.replace(/\$OG_DESCRIPTION/g, "Waiting Verification");
      result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
      response.send(result);
    });
  });

  app.get('/verified', function(request, response) {
    console.log('test page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html')
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, 'Verified');
      data = data.replace(/\$OG_DESCRIPTION/g, "Verified");
      result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
      response.send(result);
    });
  });

  app.get('/user', function(request, response) {
    console.log('test page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html')
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, 'User');
      data = data.replace(/\$OG_DESCRIPTION/g, "User Page");
      result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
      response.send(result);
    });
  });

  app.get('/verificationUser', function(request, response) {
    console.log('test page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html')
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, 'Verification User');
      data = data.replace(/\$OG_DESCRIPTION/g, "Verification User");
      result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
      response.send(result);
    });
  });

  app.get('/changePassword', function(request, response) {
    console.log('test page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html')
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, 'Change Password');
      data = data.replace(/\$OG_DESCRIPTION/g, "Change Password");
      result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
      response.send(result);
    });
  });

  app.get('/payment', function(request, response) {
    console.log('test page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html')
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, 'Payment Page');
      data = data.replace(/\$OG_DESCRIPTION/g, "Payment Page");
      data = data.replace(/\$OG_TOKEN/g, 'SB-Mid-client-Ttge99xVU4AOz44T');
      result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');

      response.send(result);
    });
  });

  app.get(`/project-detail`, function(request, response) {
    console.log('test page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html')
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }

      Axios.get(URL_API + `/project/getDetailProject?id=${req.query.id}`)
        .then((res) => {
            console.log(res.data)
            data = data.replace(/\$OG_TITLE/g, `${res.data.results[0].projectName}`);
            data = data.replace(/\$OG_DESCRIPTION/g, `${res.data.results[0].shareDescription}`);
            result = data.replace(/\$OG_IMAGE/g, `${URL_API}${res.data.results[0].projectImage}`);  

        })
        .catch((err) => {
          console.log(err)
        })

      
      response.send(result);
    });
  });

app.use(express.static(path.resolve(__dirname, './build')));

app.get('*', function(request, response) {
  const filePath = path.resolve(__dirname, './build', 'index.html');
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Not Found');
    data = data.replace(/\$OG_DESCRIPTION/g, "Not Found");
    result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
    response.send(result);
  });
  // response.sendFile(filePath);
});



app.listen(port, () => console.log(`Listening on port ${port}`));