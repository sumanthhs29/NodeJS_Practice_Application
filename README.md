# back end

1] signup -> POST /user/signup/
{
    "name":"admin123",
    "emailId":"admin13@gma.com",
    "phoneNo":5351080621,
    "gender":"Male",
    "dob":"29-10-1959",
    "password":"12345678"
}

2] check signin -> POST /user/checksignin/
{
    "name":"robert",
    "emailId":"admin13@gma.com",
    "phoneNo":5351080621,
    "gender":"Male",
    "password":"12345678"
}

3] user login -> POST /user/login/
{
    "emailId":"admin13@gma.com",
    "password":"12345678"
}

4] forgot password -> POST /user/forgotPassword/
{
    "emailId":"admin13@gma.com"
}

5] reset password -> POST 
{
    "password":"12345678",
    "passwordConfirm":"12345678"
}

6] signout -> GET /user/signout/

7] get all users -> /user/

#Story API
1] add location -> POST /story/location
{
    "name":"Bharatha",
    "latitude":26.8779,
    "longitude":84.7857,
    "aliasName":["India"]
}

2] get all location -> /story/location

3] add character -> POST /story/character
{
    "name":"Akbar",
    "dob":"132 BC",
    "death":"55 BC",
    "gender":"Male"
}

4] get all character -> /story/character

5] add category -> POST /story/category
{
    "name":"Dynasty",
    "image":"dynasty.img"
}

6] get all category -> /story/category

7] add story -> POST /story/story
{
    "storyName":"Mahabharata",
    "language":"English",
    "startYear":"268 BC",
    "endYear":"232 BC",
    "imageUrl":"https://www.requiredbrain.com/wp-content/uploads/2020/12/dharma-yuddha-.jpg",
    "categoryId":["608fdf1e311699569c1ea396"],
    "characterId":["6092b11de7d28f3b90e17e67"],
    "locationId":["60a767b734ba1279ac16f158"]
}

8] get all story -> /story/story

9] get all story language -> /story/language

10] increment view of story -> PATCH story/story/{storyID}?emailId=user@gmail.com

11] search story by name -> /story/search/?name=Ashoka

12] get popular story -> /story/popular

13] get recent added stories -> /story/recent

14] get watch list of user -> /story/watchlist?emailId=dummy1@gmail.com

15] get you may also like for user -> /story/youmaylike?emailId=user@gmail.com

16] add chapter -> POST /story/chapter
{
    "chapterName":"Chapter1",
    "serialNumber":1,
    "description":"Introduction",
    "storyId":"60a7692c34ba1279ac16f159",
    "imageUrl":"https://t4.ftcdn.net/jpg/03/43/51/97/360_F_343519727_IMdvxElh52Z4yMJVXHpmoPML2BS6eXqn.jpg",
    "storyUrl":"stories/Ramayana/mahabharatachapter2.html"
}

17] get all chapter -> /story/chapter

18] get chapter by story id -> /story/chapter/{storyId}

19] add chapter html -> POST /story/chapter/upload/{chapterID}
upload html file as form-data in body with key = upload

20] get chapter html -> /story/chapter/html/{chapterId}

21] add chapter review -> POST /story/review/
{
    "review":"Good chapter",
    "rating":4,
    "chapterId":"608d8fc9e0bed990449389cd",
    "userId":"60865092b74bca3b28ddac0f"
}

22] get chapter review -> /story/review/

#Ecommerce API
1] add user address -> POST /ecommerce/address
{
    "fullName":"Sumanth H S",
    "address1":"Sit 15th cross",
    "city":"Tumkur",
    "state":"Karnataka",
    "postCode":572103,
    "phoneNo":8218432932,
    "userId":"609eb0ff00aadd2244de43dc"
}

2] add category -> POST /ecommerce/category
{
    "name":"dummy category",
    "description":"Religious Books"
}

3] add subcategory -> POST /ecommerce/subcategory/
{
    "name":"dummy subcategory",
    "description":"Know the history of our country",
    "categoryId":"6098baf7d5ee11170c32a04a"
}

4] add product -> POST /ecommerce/product/
{
    "name":"dummy product",
    "description":"The Legend of Rama Setu",
    "price":399,
    "stock":10,
    "image":["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9upoirym2QvjL3R-h1_SKdpZ3nxWkQsQfzg&usqp=CAU"],
    "categoryId":"60a356533f73896c08a3d20f",
    "subCategoryId":"60a356773f73896c08a3d210"
}

5] add to cart -> POST /ecommerce/cart
{
    "userId":"60865092b74bca3b28ddac0f",
    "productId":"6098c032c0af7c2688976864"
}

6] add to order -> POST /ecommerce/order/6099061515c6dd0df4eed83f
{
    "amount":299,
    "addressId":"60a356833f73896c08a3d211",
    "paymentId":"order_HC8phiDSlnS8LJ",
    "products":[
        {
            "productId":"6098c032c0af7c2688976864",
            "quantity":2
        },
        {
            "productId":"6098cd05c0af7c2688976865",
            "quantity":1
        }
    ]
}

7] payment -> POST /order

8] delete product from cart -> /ecommerce/cart/:userId/:productId

9] get product by categoryId -> /ecommerce/product?categoryId=6098baf7d5ee11170c32a04a

10] get user address, category, sub-category, products, cart details, all order details

11] get order details -> /ecommerce/order/6099061515c6dd0df4eed83f

#Quiz API
1] add quiz for story -> POST /quiz
{
    "questions":[
      {
          "question":"Where are you?",
          "options":{
           "option1":"1",
           "option2":"3",
           "option3":"0",
           "option4":"abc"
          },
          "correctAnswer":"a"
      }
    ],
    "storyId":"608cf1fba057f13df0e2c63c"
}

2] get story quiz -> /quiz

#Admin API

1] admin login -> POST /admin/login/
{
    "emailId":"admin13@gma.com",
    "password":"12345678"
}

2] edit order status -> PATCH /admin/eorder/60a3e4cfbdd7ef1618c22f60
{
    "status":"delivered"
}

3] edit location,character,category,story,chapter,chapter html, ecom-category,-subcategory,-product

4] delete story,chapter
