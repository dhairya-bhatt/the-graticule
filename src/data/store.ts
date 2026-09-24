import baselinePosts from './posts.json';
import baselineAuthors from './authors.json';

export interface Author {
  name: string;
  title: string;
  affiliation: string;
  bio: string;
  avatar?: string;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  author: string;
  authorTitle?: string;
  authorAffiliation?: string;
  authorBio?: string;
  date: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  categories: string[];
  url: string;
  contentLength: number;
  bodyHtml?: string;
  bodyText?: string;
}

const STORAGE_KEY_POSTS = 'graticule_editorial_posts';
const STORAGE_KEY_AUTHORS = 'graticule_editorial_authors';
const STORAGE_PREFIX_BODY = 'graticule_body_';
const STORAGE_KEY_AUTH_TOKEN = 'graticule_admin_session';

export function getPosts(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    }
  } catch (e) {
    console.error('Error reading posts from storage:', e);
  }
  const seeded = ([...baselinePosts] as Post[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(seeded));
  } catch (e) {}
  return seeded;
}

export function getAuthors(): Record<string, Author> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTHORS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading authors from storage:', e);
  }
  const seeded = { ...baselineAuthors } as Record<string, Author>;
  try {
    localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(seeded));
  } catch (e) {}
  return seeded;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const posts = getPosts();
  const meta = posts.find(p => p.slug === slug) || posts[0];

  try {
    const cachedBody = localStorage.getItem(STORAGE_PREFIX_BODY + slug);
    if (cachedBody) {
      const parsed = JSON.parse(cachedBody);
      return {
        ...meta,
        bodyHtml: parsed.bodyHtml || parsed,
        bodyText: parsed.bodyText || meta.excerpt
      };
    }
  } catch (e) {}

  try {
    const res = await fetch('/posts/' + encodeURIComponent(slug) + '.json');
    if (res.ok) {
      const json = await res.json();
      return {
        ...meta,
        ...json
      };
    }
  } catch (e) {
    console.warn('Could not fetch static post json:', e);
  }

  return {
    ...meta,
    bodyHtml: meta.bodyHtml || '<p>' + meta.excerpt + '</p>'
  };
}

export function savePost(postMeta: Partial<Post> & { title: string }, fullBodyHtml?: string): Post {
  const posts = getPosts();
  const authors = getAuthors();

  const authorName = (postMeta.author || 'The Graticule').trim();
  const authorData = authors[authorName] || {
    name: authorName,
    title: 'Contributing Author',
    affiliation: "School of Natural and Built Environment, Queen's University Belfast",
    bio: ''
  };

  const slug = postMeta.slug || postMeta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existingIndex = posts.findIndex(p => p.slug === slug || (postMeta.id && p.id === postMeta.id));

  const wordCount = (fullBodyHtml || postMeta.excerpt || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const calculatedReadTime = Math.max(1, Math.ceil(wordCount / 180)) + ' min read';

  const finalPost: Post = {
    id: postMeta.id || (existingIndex >= 0 ? posts[existingIndex].id : Date.now()),
    slug,
    title: postMeta.title.trim(),
    author: authorData.name,
    authorTitle: authorData.title,
    authorAffiliation: authorData.affiliation,
    authorBio: authorData.bio,
    date: postMeta.date || new Date().toISOString(),
    readTime: postMeta.readTime || calculatedReadTime,
    excerpt: postMeta.excerpt ? postMeta.excerpt.trim() : (fullBodyHtml || '').replace(/<[^>]+>/g, ' ').slice(0, 180) + '...',
    coverImage: postMeta.coverImage || '',
    categories: postMeta.categories && postMeta.categories.length > 0 ? postMeta.categories : ['General Geography'],
    url: '/post/?slug=' + encodeURIComponent(slug),
    contentLength: (fullBodyHtml || '').length
  };

  if (existingIndex >= 0) {
    posts[existingIndex] = finalPost;
  } else {
    posts.unshift(finalPost);
  }

  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));

  if (fullBodyHtml !== undefined) {
    localStorage.setItem(STORAGE_PREFIX_BODY + slug, JSON.stringify({
      bodyHtml: fullBodyHtml,
      bodyText: fullBodyHtml.replace(/<[^>]+>/g, ' ')
    }));
  }

  return finalPost;
}

export function deletePost(slug: string): boolean {
  const posts = getPosts();
  const filtered = posts.filter(p => p.slug !== slug);
  if (filtered.length !== posts.length) {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(filtered));
    localStorage.removeItem(STORAGE_PREFIX_BODY + slug);
    return true;
  }
  return false;
}

export function saveAuthor(author: Author): Author {
  const authors = getAuthors();
  authors[author.name.trim()] = {
    ...author,
    name: author.name.trim()
  };
  localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(authors));

  const posts = getPosts();
  let updatedAny = false;
  posts.forEach(p => {
    if (p.author === author.name.trim()) {
      p.authorTitle = author.title;
      p.authorAffiliation = author.affiliation;
      p.authorBio = author.bio;
      updatedAny = true;
    }
  });
  if (updatedAny) {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  }

  return author;
}

export function deleteAuthor(name: string): boolean {
  const authors = getAuthors();
  if (authors[name]) {
    delete authors[name];
    localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(authors));
    return true;
  }
  return false;
}

export function exportDatabase(): { posts: Post[]; authors: Record<string, Author> } {
  return {
    posts: getPosts(),
    authors: getAuthors()
  };
}

export function resetToBaseline(): void {
  localStorage.removeItem(STORAGE_KEY_POSTS);
  localStorage.removeItem(STORAGE_KEY_AUTHORS);
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_PREFIX_BODY)) {
      localStorage.removeItem(key);
    }
  });
  getPosts();
  getAuthors();
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(STORAGE_KEY_AUTH_TOKEN) === 'authenticated';
}

export function adminLogin(username: string, pass: string): boolean {
  const savedCreds = localStorage.getItem('graticule_admin_creds');
  let validUser = 'admin';
  let validPass = 'graticule2021';
  if (savedCreds) {
    try {
      const parsed = JSON.parse(savedCreds);
      validUser = parsed.username || validUser;
      validPass = parsed.password || validPass;
    } catch (e) {}
  }

  if (username.trim() === validUser && pass === validPass) {
    sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, 'authenticated');
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
}

export function updateAdminCredentials(newUsername: string, newPass: string): void {
  localStorage.setItem('graticule_admin_creds', JSON.stringify({
    username: newUsername.trim(),
    password: newPass
  }));
}
