API

# /auth/register

## POST

**body**

- user_name: mandatory, string
- email: mandatory, string, is checking if is an email format
- password: mandatory, string
- name: mandatory, string
- phone: string
- address: string
- artist: string, if the user is an artist send value "1" else "0"

For the password there are the following checks:

- length must be grater then 8
- must contains minimum 4 lowercase letters
- must contains minimum 2 Uppercase letters
- must contains minimum 1 number
- must contains minimum 1 symbol
-

# /auth/login

## POST

**body** :

- userName: mandatory , string
- password: mandatory , string

If succes it generates one token and is send in response.

# /auth/refresh-token

## POST

Cookie tokenRefresh must be valid.

# /api//general/materials/add

## POST

**body** :

- name: mandatory , string

# /api//general/surfaces/add

## POST

**body**

- name: mandatory , string

# /api/general/materials

## POST

**response**

[
{
"id": 1,
"name": "The name of the material"
}
]

# /api//general/surfaces

## POST

**response**

[
{
"id": 1,
"name": "The name of the surface"
}
]

# /api/general/dimensions

## POST

**response**
[
{
"id": "3",
"name": "small",
"min_area": "0",
"max_area": "100"
}
]

# /api/general/dimensions/add

## POST

**body**
params all mandatory:
{
"name": "small",
"min_area": "0",
"max_area": 100
}

# /picture/upload

## POST

**Authorization**
token send at login. Is mandatory.

**Body**

(all mandatory)
image (file)
id_material (text)
id_surface (text)
title (text)
description (text)
width (text)
height (text)
price (text)

# /picture/getAll

## POST

**response**

[
{
"id": 12,
"id_material": 1,
"material_name": "Glass",
"id_surface": 1,
"surface_name": "Glass",
"title": "Title",
"description": "Description",
"length": "100",
"width": "200",
"price": "9.8",
"share_path": "https://res.cloudinary.com/do5lfyys6/image/upload/v1736859790/dn6gk6u3daxj8wp8rpyt.jpg",
"id_user": 1,
"name": "RO-TARU",
"uploaded_date": null
},
{
"id": 13,
"id_material": 1,
"material_name": "Glass",
"id_surface": 1,
"surface_name": "Glass",
"title": "Title",
"description": "Description",
"length": "100",
"width": "200",
"price": "9.8",
"share_path": "https://res.cloudinary.com/do5lfyys6/image/upload/v1736859888/dzfw9hmtaswzjkkrddkr.jpg",
"id_user": 1,
"name": "RO-TARU",
"uploaded_date": null
},
{
"id": 14,
"id_material": 1,
"material_name": "Glass",
"id_surface": 1,
"surface_name": "Glass",
"title": "Title",
"description": "Description",
"length": "100",
"width": "200",
"price": "9.8",
"share_path": "https://res.cloudinary.com/do5lfyys6/image/upload/v1736859949/c6sfepk3mf61odtkmsfb.jpg",
"id_user": 1,
"name": "RO-TARU",
"uploaded_date": null
},
{
"id": 15,
"id_material": 1,
"material_name": "Glass",
"id_surface": 1,
"surface_name": "Glass",
"title": "Title",
"description": "Description",
"length": "100",
"width": "200",
"price": "9.8",
"share_path": "https://res.cloudinary.com/do5lfyys6/image/upload/v1736860864/vepzsapg7z6osfntdy68.jpg",
"id_user": 1,
"name": "RO-TARU",
"uploaded_date": null
},
{
"id": 16,
"id_material": 1,
"material_name": "Glass",
"id_surface": 1,
"surface_name": "Glass",
"title": "Title",
"description": "Description",
"length": "100",
"width": "200",
"price": "9.8",
"share_path": "https://res.cloudinary.com/do5lfyys6/image/upload/v1736861133/vbv77d64bllynnd3ahab.jpg",
"id_user": 1,
"name": "RO-TARU",
"uploaded_date": "2025-01-13T23:00:00.000Z"
}
]

# /picture/getByUser

## POST

**Authorization**
token send at login (that its generated on login - see /auth/login). Is mandatory.

**response**
[
{
"id": 28,
"id_material": 1,
"material_name": "Glass",
"id_surface": 1,
"surface_name": "round",
"title": "Title",
"description": "Description",
"length": "100",
"width": "200",
"price": "9.8",
"share_path": "https://res.cloudinary.com/do5lfyys6/image/upload/v1736935703/hk35otpy8pvlxsken3bv.png",
"id_user": 2,
"name": "RO-TARU",
"uploaded_date": "2025-01-14T23:00:00.000Z"
}
]

# /picture/getByIdUser

## POST

**Body**
{
"idUser": 1
}

**response**
[
{
"id": 28,
"id_material": 1,
"material_name": "Glass",
"id_surface": 1,
"surface_name": "round",
"title": "Title",
"description": "Description",
"length": "100",
"width": "200",
"price": "9.8",
"share_path": "https://res.cloudinary.com/do5lfyys6/image/upload/v1736935703/hk35otpy8pvlxsken3bv.png",
"id_user": 1,
"name": "RO-TARU",
"uploaded_date": "2025-01-14T23:00:00.000Z"
}
]

# /picture/getFiltered

## POST

**Body**
{
"materials": [4, 5],
"surfaces": [3,6],
"dimensions":[3, 4],
"prices": { "min": 0, "max": 2000}

}
materials , surfaces, dimensions can be empty arrays.

**response :**
[
{
"id": 2,
"id_material": 4,
"material_name": "momo",
"id_surface": 3,
"surface_name": "wood",
"title": "Title 2",
"description": "desc2",
"width": "500",
"height": "2000",
"price": "989",
"share_path": "https://res.cloudinary.com/do5lfyys6/image/upload/v1737025861/ArtZVision/qftino87g0j5nxgi9rw3.png",
"id_user": 2,
"name": "USER",
"uploaded_date": "2025-01-15T23:00:00.000Z"
},
{
"id": 3,
"id_material": 5,
"material_name": "oil painting",
"id_surface": 3,
"surface_name": "wood",
"title": "Title 3",
"description": "desc3",
"width": "150",
"height": "890",
"price": "170",
"share_path": "https://res.cloudinary.com/do5lfyys6/image/upload/v1737025893/ArtZVision/vgiestoz2zfls2xeaqzc.png",
"id_user": 2,
"name": "USER",
"uploaded_date": "2025-01-15T23:00:00.000Z"
}
]

# /review/add

## POST

**body**
artistId: text , mandatory
rating: text , mandatory
title: text , mandatory
body: text , mandatory

**Authorization**\
token sent at login

**response**
{
"Status": "Success",
"message": "The reviews has been added!"
}

# /review/getByArtist

## POST

**body**
{
"artistId": 1
}

**response**
[
{
"id": "1",
"id_artist": 1,
"id_user": 1,
"rating": "3",
"title": "Amazing product!",
"body": "The quality exceeded my expectations. Highly recommend!",
"date": "2025-01-15T23:00:00.000Z"
},
{
"id": "2",
"id_artist": 1,
"id_user": 1,
"rating": "5",
"title": "What a talent!",
"body": "I never seen somethinmg like that",
"date": "2025-01-15T23:00:00.000Z"
}
]

# /cart/add

## POST

**body**
{
"id_painting": 2,
"price": 2.4
}

**Authorization**
token sent at login (that its generated on login - see /auth/login). Is mandatory.

**response**
{
"Status": "Success",
"message": "The painting has been added!"
}

# /cart/view

## POST

**Authorization**
token sent at login (that its generated on login - see /auth/login). Is mandatory.

**response**
[
{
"id": 4,
"id_user": 1,
"id_painting": 2,
"price": "2.4",
"date": "2025-01-16T23:00:00.000Z",
"title": "Title 2",
"description": "desc2",
"width": "500",
"height": "2000",
"material": "momo",
"surface": "wood",
"id_artist": 2,
"artist": "USER"
},
{
"id": 5,
"id_user": 1,
"id_painting": 2,
"price": "2.4",
"date": "2025-01-16T23:00:00.000Z",
"title": "Title 2",
"description": "desc2",
"width": "500",
"height": "2000",
"material": "momo",
"surface": "wood",
"id_artist": 2,
"artist": "USER"
}
]

# /cart/sendToPay

## POST

**Authorization**
token sent at login (that its generated on login - see /auth/login). Is mandatory.

**body**
{
"cart_paintings": [
{"id": 1, "price":2.5},
{"id": 2, "price":3232}
]
}

**response**
{
"Status": "Success",
"message": "The order is send!"
}
{
"Status": "Error",
"message": {
"length": 246,
"name": "error",
"severity": "ERROR",
"code": "23503",
"detail": "Key (id_cart)=(991) is not present in table \"cart_products\".",
"schema": "public",
"table": "order_details",
"constraint": "fk_cart",
"file": "ri_triggers.c",
"line": "2641",
"routine": "ri_ReportViolation"
}
}

for me:

ip route show | grep -i default | awk '{ print $3}'

172.29.176.1\

pg_hba.conf
host all all 0.0.0.0/0 md5

git rm --cached .env
git rm -r --cached node_modules
