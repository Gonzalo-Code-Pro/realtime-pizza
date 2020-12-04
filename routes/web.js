const homeController = require('../app/http/controllers/homeControllers')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController');
const guest  =require('../app/http/midlewares/guest')



function initRoutes(app) {

  app.get("/", homeController().index)
  app.get('/login', guest,authController().login)


  app.post('/login', authController().postLogin)
  


  app.get('/register',guest, authController().register)


  app.get('/logout',authController().logout)

  app.post('/register',authController().postRegister)
  app.get('/cart', cartController().index)
  app.post('/update-cart',cartController().update)
}

module.exports = initRoutes
