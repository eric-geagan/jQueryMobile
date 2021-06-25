var express = require('express');
var router = express.Router();

serverList = []

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getList', function(req, res) {
  res.status(200).json(serverList)
})

router.post('/addItem', function(req, res) {
  const newItem = req.body
  serverList.push(newItem)
  res.status(200)
})

router.delete('/deleteItem/:id', (req, res) => {
  const id = req.params.id
  // console.log('deleteing ID: ' + id)
  let found = false
  for(let i = 0; i < serverList.length; i++) {
    // console.log(serverList[i].id, id)
    if (serverList[i].id == id) {
      serverList.splice(i, 1)
      found = true
      break;
    }
  }
  if (!found) {
    // console.log('not found')
    return res.status(500).json({
      status: 'error'
    })
  } else {
    res.status(200).json('deleted item')
  }
})

module.exports = router;
