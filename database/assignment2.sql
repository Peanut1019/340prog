INSERT INTO public.account (
    account_firstname,
    account_lastname,
    iaccount_email,
    account_password,
    account_type
  )
VALUES   (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n',
    'Admin'
  );
DELETE FROM public.account WHERE account_id = 1;
UPDATE public.inventory SET inv_description = REPLACE(inv_description, 'small interiors','a huge interior') WHERE inv_model = 'Hummer';
SELECT
    inv_make,
    inv_model,
    classification_name
FROM
    public.inventory
INNER JOIN public.classification
    ON classification_name = 'Sport';
UPDATE public.inventory SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');