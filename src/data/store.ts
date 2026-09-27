import baselinePosts from './posts.json';
import baselineAuthors from './authors.json';
import { getUrl } from '../utils/url';
import { getSupabaseClient, isSupabaseConnected } from '../lib/supabase';

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
  subtitle?: string;
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
    const res = await fetch(getUrl('/posts/' + encodeURIComponent(slug) + '.json'));
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

  // Sync to Supabase cloud if connected
  if (isSupabaseConnected()) {
    const client = getSupabaseClient();
    if (client) {
      client.from('posts').upsert({
        slug: finalPost.slug,
        title: finalPost.title,
        subtitle: finalPost.subtitle || '',
        date: finalPost.date,
        excerpt: finalPost.excerpt,
        content: fullBodyHtml || `<p>${finalPost.excerpt}</p>`,
        cover_image: finalPost.coverImage,
        author: finalPost.author,
        categories: finalPost.categories,
        read_time: finalPost.readTime
      }, { onConflict: 'slug' }).then(({ error }) => {
        if (error) console.warn('Supabase savePost error:', error.message);
      });
    }
  }

  return finalPost;
}

export function deletePost(slug: string): boolean {
  const posts = getPosts();
  const filtered = posts.filter(p => p.slug !== slug);
  if (filtered.length !== posts.length) {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(filtered));
    localStorage.removeItem(STORAGE_PREFIX_BODY + slug);

    if (isSupabaseConnected()) {
      const client = getSupabaseClient();
      if (client) {
        client.from('posts').delete().eq('slug', slug).then(({ error }) => {
          if (error) console.warn('Supabase deletePost error:', error.message);
        });
      }
    }

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

  if (isSupabaseConnected()) {
    const client = getSupabaseClient();
    if (client) {
      client.from('authors').upsert({
        id: author.name.trim(),
        name: author.name.trim(),
        title: author.title || '',
        affiliation: author.affiliation || '',
        bio: author.bio || '',
        avatar: author.avatar || ''
      }, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('Supabase saveAuthor error:', error.message);
      });
    }
  }

  return author;
}

export function deleteAuthor(name: string): boolean {
  const authors = getAuthors();
  if (authors[name]) {
    delete authors[name];
    localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(authors));

    if (isSupabaseConnected()) {
      const client = getSupabaseClient();
      if (client) {
        client.from('authors').delete().eq('id', name).then(({ error }) => {
          if (error) console.warn('Supabase deleteAuthor error:', error.message);
        });
      }
    }

    return true;
  }
  return false;
}

// Cloud Sync with Supabase
export async function syncFromSupabase(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client not connected. Please enter URL and Anon Key.' };
  }

  try {
    const { data: postsData, error: postsErr } = await client
      .from('posts')
      .select('*')
      .order('date', { ascending: false });

    if (postsErr) {
      throw new Error(`Failed to fetch articles: ${postsErr.message}`);
    }

    let postCount = 0;
    if (postsData && postsData.length > 0) {
      const mappedPosts: Post[] = postsData.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        author: p.author,
        date: p.date,
        readTime: p.read_time || '5 min read',
        excerpt: p.excerpt || '',
        coverImage: p.cover_image || '',
        categories: Array.isArray(p.categories) ? p.categories : [],
        url: getUrl(`/post/?slug=${p.slug}`),
        contentLength: (p.content || '').length,
        bodyHtml: p.content || '',
        bodyText: (p.content || '').replace(/<[^>]+>/g, ' ')
      }));
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(mappedPosts));
      postCount = mappedPosts.length;
    }

    const { data: authorsData, error: authorsErr } = await client
      .from('authors')
      .select('*');

    if (authorsErr) {
      throw new Error(`Failed to fetch authors: ${authorsErr.message}`);
    }

    let authorCount = 0;
    if (authorsData && authorsData.length > 0) {
      const authorsMap: Record<string, Author> = {};
      authorsData.forEach(a => {
        authorsMap[a.id || a.name] = {
          name: a.name,
          title: a.title,
          affiliation: a.affiliation,
          bio: a.bio,
          avatar: a.avatar
        };
      });
      localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(authorsMap));
      authorCount = Object.keys(authorsMap).length;
    }

    return {
      success: true,
      message: `Pulled ${postCount} articles and ${authorCount} authors from Supabase cloud!`
    };
  } catch (err: any) {
    console.warn('Supabase sync skipped/failed:', err);
    return {
      success: false,
      message: err?.message || 'Failed to pull cloud dispatches'
    };
  }
}

// Push all local posts and authors to Supabase
export async function syncAllToSupabase(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client not connected. Please enter URL and Anon Key.' };
  }

  try {
    const posts = getPosts();
    const authors = getAuthors();

    // 1. Upsert authors
    const authorPayload = Object.entries(authors).map(([id, a]) => ({
      id,
      name: a.name,
      title: a.title,
      affiliation: a.affiliation,
      bio: a.bio,
      avatar: a.avatar || ''
    }));

    if (authorPayload.length > 0) {
      const { error: aErr } = await client.from('authors').upsert(authorPayload, { onConflict: 'id' });
      if (aErr) throw new Error(`Failed to upsert authors: ${aErr.message}`);
    }

    // 2. Upsert posts
    const postPayload = posts.map(p => {
      let content = p.bodyHtml || '';
      if (!content) {
        const cached = localStorage.getItem(STORAGE_PREFIX_BODY + p.slug);
        if (cached) {
          try { content = JSON.parse(cached).bodyHtml; } catch (e) {}
        }
      }
      return {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle || '',
        date: p.date,
        excerpt: p.excerpt || '',
        content: content || `<p>${p.excerpt}</p>`,
        cover_image: p.coverImage || '',
        author: p.author,
        categories: p.categories || [],
        read_time: p.readTime || '5 min read'
      };
    });

    if (postPayload.length > 0) {
      const { error: pErr } = await client.from('posts').upsert(postPayload, { onConflict: 'slug' });
      if (pErr) throw new Error(`Failed to upsert posts: ${pErr.message}`);
    }

    return { 
      success: true, 
      message: `Successfully synchronized ${postPayload.length} articles and ${authorPayload.length} authors to Supabase!` 
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Synchronization failed' };
  }
}

export async function recordSubmissionToSupabase(submission: {
  authorName: string;
  authorEmail: string;
  affiliation?: string;
  articleTitle: string;
  category: string;
  abstract?: string;
  fileName?: string;
  fileSize?: string;
}): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('submissions').insert([{
      author_name: submission.authorName,
      author_email: submission.authorEmail,
      affiliation: submission.affiliation || '',
      article_title: submission.articleTitle,
      category: submission.category,
      abstract: submission.abstract || '',
      file_name: submission.fileName || '',
      file_size: submission.fileSize || '',
      status: 'submitted_via_portal'
    }]);
    if (error) {
      console.warn('Supabase submission logging notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to record submission to Supabase:', err);
    return false;
  }
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

export function hasAdminCredentials(): boolean {
  return !!localStorage.getItem('graticule_admin_creds');
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Secure PBKDF2-SHA256 password hashing via Web Crypto API (100,000 iterations, 128-bit salt)
async function hashPassword(password: string, saltHex?: string): Promise<{ salt: string; hash: string }> {
  const encoder = new TextEncoder();
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const saltStr = bytesToHex(salt);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  const hashStr = bytesToHex(new Uint8Array(derivedBits));
  return { salt: saltStr, hash: hashStr };
}

// Master single administrator profile for editorial operations.
// The plaintext password is NEVER stored anywhere in code or repository.
// Only the irreversible PBKDF2-SHA256 (100,000 iterations) hash & unique cryptographic salt are stored.
const MASTER_ADMIN = {
  username: 'editor',
  salt: 'f26679ac63c6e47c9257ffa45a48cd8f',
  hash: 'c146daaf672902bd174315f1a4f574ffc852adb7c3a4b01a3cd742f6f590f800'
};

export async function adminLogin(username: string, pass: string): Promise<boolean> {
  const cleanUser = username.trim().toLowerCase();

  // 1. Always verify against MASTER_ADMIN first so default credentials never fail
  if (cleanUser === MASTER_ADMIN.username.toLowerCase()) {
    const computed = await hashPassword(pass, MASTER_ADMIN.salt);
    if (computed.hash === MASTER_ADMIN.hash) {
      sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, 'authenticated');
      return true;
    }
  }

  // 2. Also check if user established custom credentials via settings
  const savedCreds = localStorage.getItem('graticule_admin_creds');
  if (savedCreds) {
    try {
      const parsed = JSON.parse(savedCreds);
      if (parsed.username && cleanUser === parsed.username.toLowerCase()) {
        if (parsed.salt && parsed.hash) {
          const computed = await hashPassword(pass, parsed.salt);
          if (computed.hash === parsed.hash) {
            sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, 'authenticated');
            return true;
          }
        } else if (parsed.password && parsed.password === pass) {
          sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, 'authenticated');
          return true;
        }
      }
    } catch (e) {}
  }

  return false;
}

export function clearAdminCredentialsCache(): void {
  localStorage.removeItem('graticule_admin_creds');
}

export function adminLogout(): void {
  sessionStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
}

export async function updateAdminCredentials(newUsername: string, newPass: string): Promise<void> {
  const { salt, hash } = await hashPassword(newPass);
  localStorage.setItem('graticule_admin_creds', JSON.stringify({
    username: newUsername.trim(),
    salt,
    hash
  }));
}
