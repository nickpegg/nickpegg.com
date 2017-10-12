import baseSlugify from 'slugify';


function slugify(s) {
  // Slugify a string to our specs. Hooray consistency!
  return baseSlugify(s).toLowerCase();
}

export { slugify };
