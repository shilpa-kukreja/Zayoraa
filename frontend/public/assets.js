
export const categories = [
  {
    id: 1,
    name: "Category1",
    slug: "category-1",
    img: "/category/product1.webp",
    banner:"/banner/category1banner.webp",
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias."
  
  },
  {
    id: 2,
    name: "Category2",
    slug: "category-2",
    img: "/category/product3.webp",
    banner:"/banner/category2banner.webp",
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias."
   
  },
  {
    id: 3,
    name: "Category3",
    slug: "category-3",
    img: "/category/product4.webp",
    banner:"/banner/category3banner.webp",
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias."
    
  },
  {
    id: 4,
    name: "Category4",
    slug: "category-4",
    img: "/category/product5.webp",
    banner:"/banner/category4banner.webp",
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias."
   
  },
];



export const subcategories = [
  {
    id: 1,
    name: "SubCategory1",
    slug: "subcategory-1",
    img: "/subcategory/product13.webp",
    category: ["1","2"],
    },
    {
      id: 2,
      name: "SubCategory2",

      slug: "subcategory-2",
      img: "/subcategory/product14.webp",
      category: ["1","3"],
      },
      {
        id: 3,
        name: "SubCategory3",
        slug: "subcategory-3",
        img: "/subcategory/product15.webp",
        category: ["1","4"],
        },
      ]











export const products = [
 {
    id: '1',
    name: 'Product1',
    slug: "product-1",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/product1.webp",
    galleryImg: [ "/product/product2.webp", "/product/product3.webp", "/product/product4.webp"],
    stock: '8',
    section: ['newarrival', 'bestseller', 'holidaycollection'],
    category: ["1", "2"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"Red",colorcode:"#123434", price: '200', discountPrice: "150" , stock: '8',},
        { color:"Back",colorcode:"#13465",price:"300", discountPrice: "200" , stock: '8',},
        {  color:"Blue",colorcode:"#21354",price:"450" ,discountPrice: "300", stock: '8',},
        {  color:"Beige",colorcode:"#65432",price:"500" ,discountPrice: "400" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product1',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},



 {
    id: '2',
    name: 'Product2',
    slug: "product-2",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/product5.webp",
    galleryImg: [ "/product/product6.webp", "/product/product7.webp", "/product/product8.webp"],
    stock: '8',
    section: ['newarrival', 'bestseller' , 'holidaycollection'],
    category: ["1", "3"] ,
    subcategory: ["1","3"],
    sku: 'product123',
    variant: [
        {color:"Red",colorcode:"#123434",price:"250" , discountPrice: "150" , stock: '8',},
        {color:"Back",colorcode:"#13465",price:"300" ,discountPrice: "200" , stock: '8',},
        
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product2',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},

 {
    id: '3',
    name: 'Product3',
    slug: "product-3",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/product10.webp",
    galleryImg: [ "/product/product11.webp", "/product/product12.webp", "/product/product13.webp"],
    stock: '8',
    section: ['newarrival', 'bestseller','holidaycollection','featuredcollection'],
    category: ["1", "4"] ,
    subcategory: ["2","3"],
    sku: 'product123',
    variant: [
        { color:"Dark Tape",colorcode:"#21543",price:"250" ,discountPrice: "150" , stock: '8',},
       
       
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product3',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},

 {
    id: '4',
    name: 'Product4',
    slug: "product-4",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/product16.webp",
    galleryImg: [ "/product/product17.webp", "/product/product18.webp", "/product/product13.webp"],
    stock: '10',
    section: ['newarrival', 'bestseller','featuredcollection'],
    category: ["1", "2"] ,
    subcategory: ["1","4"],
    sku: 'product123',
    variant: [
        { color:"violet",colorcode:"#21565", price: '300', discountPrice: "150" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product4',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},

 {
    id: '5',
    name: 'Product5',
    slug: "product-5",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/product10.webp",
    galleryImg: [ "/product/product11.webp", "/product/product13.webp", "/product/product15.webp"],
    stock: '10',
    section: ['newarrival','holidaycollection','featuredcollection'],
    category: ["1", "2"] ,
    subcategory: ["1","4"],
    sku: 'product123',
    variant: [
        { color:"Wine",colorcode:"#3145", price: '500', discountPrice: "450" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product5',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},

 {
    id: '6',
    name: 'Product6',
    slug: "product-6",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/product8.webp",
    galleryImg: [ "/product/product9.webp", "/product/product10.webp", "/product/product11.webp"],
    stock: '10',
    section: ['bestseller','featuredcollection'],
    category: ["1", "3"] ,
    subcategory: ["1","4"],
    sku: 'product123',
    variant: [
        { color:"Wine",colorcode:"#3145", price: '600', discountPrice: "550" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product6',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},

 {
    id: '7',
    name: 'Product7',
    slug: "product-7",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/productcard1.jpg",
    galleryImg: [ "/product/product9.webp", "/product/product10.webp", "/product/product11.webp"],
    stock: '10',
    section: ['bestseller','holidaycollection'],
    category: ["1", "2"] ,
    subcategory: ["1","4"],
    sku: 'product123',
    variant: [
        { color:"Wine",colorcode:"#42156", price: '550', discountPrice: "450" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product7',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},

 {
    id: '8',
    name: 'Product8',
    slug: "product-8",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/productcard2.webp",
    galleryImg: [ "/product/product15.webp", "/product/product16.webp", "/product/product17.webp"],
    stock: '10',
    section: ['newarrival','featuredcollection'],
    category: ["1", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '400', discountPrice: "350" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product8',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},

 {
    id: '9',
    name: 'Product9',
    slug: "product-9",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/productcard2.webp",
    galleryImg: [ "/product/product15.webp", "/product/product16.webp", "/product/product17.webp"],
    stock: '10',
    section: ['newarrival','holidaycollection','featuredcollection'],
    category: ["1", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '400', discountPrice: "350" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product9',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},


 {
    id: '10',
    name: 'Product10',
    slug: "product-10",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/productcard2.webp",
    galleryImg: [ "/product/product15.webp", "/product/product16.webp", "/product/product17.webp"],
    stock: '10',
    section: ['bestseller','holidaycollection'],
    category: ["1", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '900', discountPrice: "850" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product10',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},


 {
    id: '11',
    name: 'Product11',
    slug: "product-11",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/productcard2.webp",
    galleryImg: [ "/product/product15.webp", "/product/product16.webp", "/product/product17.webp"],
    stock: '10',
    section: ['bestseller','featuredcollection'],
    category: ["1", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '450', discountPrice: "400" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product11',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},


 {
    id: '12',
    name: 'Product12',
    slug: "product-12",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/productcard2.webp",
    galleryImg: [ "/product/product15.webp", "/product/product16.webp", "/product/product17.webp"],
    stock: '10',
    section: ['bestseller','holidaycollection'],
    category: ["1", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '700', discountPrice: "550" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product12',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},



 {
    id: '13',
    name: 'Product13',
    slug: "product-13",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/productcard2.webp",
    galleryImg: [ "/product/product15.webp", "/product/product16.webp", "/product/product17.webp"],
    stock: '10',
    section: ['bestseller','featuredcollection'],
    category: ["1", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '400', discountPrice: "350" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product13',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},



 {
    id: '14',
    name: 'Product14',
    slug: "product-14",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/productcard2.webp",
    galleryImg: [ "/product/product15.webp", "/product/product16.webp", "/product/product17.webp"],
    stock: '10',
    section: ['bestseller','holidaycollection','featuredcollection'],
    category: ["1", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '400', discountPrice: "350" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product14',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},

     {
    id: '15',
    name: 'Product15',
    slug: "product-15",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/product15.webp",
    galleryImg: [ "/product/productcard2.webp", "/product/product16.webp", "/product/product17.webp"],
    stock: '10',
    section: ['newarrival','holidaycollection'],
    category: ["1", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '600', discountPrice: "450" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product15',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},


 {
    id: '16',
    name: 'Product16',
    slug: "product-16",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/product16.webp",
    galleryImg: [ "/product/product15.webp", "/product/productcard2.webp", "/product/product17.webp"],
    stock: '10',
    section: ['newarrival','holidaycollection','featuredcollection'],
    category: ["1", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '800', discountPrice: "650" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product16',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},



 {
    id: '17',
    name: 'Product17',
    slug: "product-17",
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.',
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molestias.",
    thumbImg: "/product/productcard2.webp",
    galleryImg: [ "/product/product15.webp", "/product/product16.webp", "/product/product17.webp"],
    stock: '10',
    section: ['newarrival','featuredcollection'],
    category: ["2", "3"] ,
    subcategory: ["1","2"],
    sku: 'product123',
    variant: [
        { color:"blue",colorcode:"#42156", price: '400', discountPrice: "350" , stock: '8',},
    ],

    status: 'active',
    width: '100',
    height: '100',
    weight: '1',
    length: '10',
    metatitle: 'Product17',
    metadescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, molest ias.',

},

]


export const videos = [
  {
    id: '1',
    videourl: '/videos/video1.mp4',
    productid: '1',
    order: '1',
  },
  {
    id: '2',
    videourl: '/videos/video2.mp4',
    productid: '2',
    order: '2',
    },
    {
      id: '3',
    
      videourl: '/videos/video3.mp4',
      productid: '3',
      order: '3',
      },
      {
        id: '4',
        videourl: '/videos/video4.mp4',
        productid: '4',
        order: '4',
        },
        {
          id: '5',
          videourl: '/videos/video5.mp4',
          productid: '5',
          order: '5',
          },
          {
            id: '6',
            videourl: '/videos/video6.mp4',
            productid: '6',
            order: '6',
            },


          ]




export const addressDummyData = [
  {
    "_id": "67a1e4233f34a77b6dde9055",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "fullName": "GreatStack",
    "phoneNumber": "0123456789",
    "pincode": 654321,
    "area": "Main Road , 123 Street, G Block",
    "city": "City",
    "state": "State",
    "__v": 0
  }
]

export const blogs = [
             {
              id:1,
              blogImg:"/product/productcard2.webp",
              blogName:"BlogProduct1",
              blogSlug:"blogproduct1",
              blogDate:"Sep 02, 2025",
              blogDetail:"Quisque lacinia molestie erat, vitae tincidunt ligula efficitur et. Mauris egestas laoreet neque, quis maximus nisl consequat a. Nam sed rhoncus massa. Sed vulputate massa ac justo scelerisque, lobortis tincidunt tortor blandit. Proin posuere in mauris ut dapibus. Donec posuere, nulla et tristique varius, metus sem commodo nisl, eget aliquam mi arcu vel risus. Duis a commodo nibh. Integer dictum, ligula eget semper sollicitudin, quam nisl tempor massa, vitae scelerisque metus neque sit amet nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla ac gravida lacus, et semper lectus. Morbi rhoncus, augue vestibulum maximus molestie, ante nunc vestibulum massa, lobortis molestie purus metus at tortor. Morbi consectetur vehicula tellus, non pellentesque libero hendrerit at. Nulla vel varius justo, sit amet dignissim erat."
           },
           {
              id:2,
              blogImg:"/product/product4.webp",
              blogName:"BlogProduct2",
              blogSlug:"blogproduct2",
              blogDate:"Sep 03, 2025",
              blogDetail:"Quisque lacinia molestie erat, vitae tincidunt ligula efficitur et. Mauris egestas laoreet neque, quis maximus nisl consequat a. Nam sed rhoncus massa. Sed vulputate massa ac justo scelerisque, lobortis tincidunt tortor blandit. Proin posuere in mauris ut dapibus. Donec posuere, nulla et tristique varius, metus sem commodo nisl, eget aliquam mi arcu vel risus. Duis a commodo nibh. Integer dictum, ligula eget semper sollicitudin, quam nisl tempor massa, vitae scelerisque metus neque sit amet nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla ac gravida lacus, et semper lectus. Morbi rhoncus, augue vestibulum maximus molestie, ante nunc vestibulum massa, lobortis molestie purus metus at tortor. Morbi consectetur vehicula tellus, non pellentesque libero hendrerit at. Nulla vel varius justo, sit amet dignissim erat."
           },
           {
              id:3,
              blogImg:"/product/product8.webp",
              blogName:"BlogProduct3",
              blogSlug:"blogproduct3",
              blogDate:"Sep 10, 2025",
              blogDetail:"Quisque lacinia molestie erat, vitae tincidunt ligula efficitur et. Mauris egestas laoreet neque, quis maximus nisl consequat a. Nam sed rhoncus massa. Sed vulputate massa ac justo scelerisque, lobortis tincidunt tortor blandit. Proin posuere in mauris ut dapibus. Donec posuere, nulla et tristique varius, metus sem commodo nisl, eget aliquam mi arcu vel risus. Duis a commodo nibh. Integer dictum, ligula eget semper sollicitudin, quam nisl tempor massa, vitae scelerisque metus neque sit amet nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla ac gravida lacus, et semper lectus. Morbi rhoncus, augue vestibulum maximus molestie, ante nunc vestibulum massa, lobortis molestie purus metus at tortor. Morbi consectetur vehicula tellus, non pellentesque libero hendrerit at. Nulla vel varius justo, sit amet dignissim erat."
           },
           {
              id:4,
              blogImg:"/product/product11.webp",
              blogName:"BlogProduct4",
              blogSlug:"blogproduct4",
              blogDate:"Sep 11, 2025",
              blogDetail:"Quisque lacinia molestie erat, vitae tincidunt ligula efficitur et. Mauris egestas laoreet neque, quis maximus nisl consequat a. Nam sed rhoncus massa. Sed vulputate massa ac justo scelerisque, lobortis tincidunt tortor blandit. Proin posuere in mauris ut dapibus. Donec posuere, nulla et tristique varius, metus sem commodo nisl, eget aliquam mi arcu vel risus. Duis a commodo nibh. Integer dictum, ligula eget semper sollicitudin, quam nisl tempor massa, vitae scelerisque metus neque sit amet nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla ac gravida lacus, et semper lectus. Morbi rhoncus, augue vestibulum maximus molestie, ante nunc vestibulum massa, lobortis molestie purus metus at tortor. Morbi consectetur vehicula tellus, non pellentesque libero hendrerit at. Nulla vel varius justo, sit amet dignissim erat."
           },
           {
              id:5,
              blogImg:"/product/product6.webp",
              blogName:"BlogProduct5",
              blogSlug:"blogproduct5",
              blogDate:"Sep 12, 2025",
              blogDetail:"Quisque lacinia molestie erat, vitae tincidunt ligula efficitur et. Mauris egestas laoreet neque, quis maximus nisl consequat a. Nam sed rhoncus massa. Sed vulputate massa ac justo scelerisque, lobortis tincidunt tortor blandit. Proin posuere in mauris ut dapibus. Donec posuere, nulla et tristique varius, metus sem commodo nisl, eget aliquam mi arcu vel risus. Duis a commodo nibh. Integer dictum, ligula eget semper sollicitudin, quam nisl tempor massa, vitae scelerisque metus neque sit amet nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla ac gravida lacus, et semper lectus. Morbi rhoncus, augue vestibulum maximus molestie, ante nunc vestibulum massa, lobortis molestie purus metus at tortor. Morbi consectetur vehicula tellus, non pellentesque libero hendrerit at. Nulla vel varius justo, sit amet dignissim erat."
           },
]






