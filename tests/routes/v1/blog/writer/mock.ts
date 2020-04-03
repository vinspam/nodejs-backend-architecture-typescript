import Blog from '../../../../../src/database/model/Blog';
import { Types } from 'mongoose';
import { USER_ID_WRITER } from '../../../../auth/authorization/mock';

jest.unmock('../../../../../src/database/repository/BlogRepo');

export const BLOG_ID = new Types.ObjectId();
export const BLOG_ID_2 = new Types.ObjectId();
export const BLOG_URL = 'abc';

export const mockBlogFindUrlIfExists = jest.fn(async (blogUrl: string): Promise<Blog> => {
	if (blogUrl === BLOG_URL) return <Blog>{
		_id: BLOG_ID,
		blogUrl: blogUrl
	};
	return null;
});

export const mockBlogCreate = jest.fn(async (blog: Blog): Promise<Blog> => {
	blog._id = BLOG_ID;
	return blog;
});

export const mockBlogUpdate = jest.fn(async (blog: Blog): Promise<Blog> => blog);

export const mockFindBlogAllDataById = jest.fn(async (id: Types.ObjectId): Promise<Blog> => {
	if (BLOG_ID.equals(id)) return <Blog>{
		_id: BLOG_ID,
		author: { _id: USER_ID_WRITER },
		isDraft: true,
		isSubmitted: false,
		isPublished: false
	};
	if (BLOG_ID_2.equals(id)) return <Blog>{
		_id: BLOG_ID,
		author: { _id: new Types.ObjectId() },
		isDraft: true,
		isSubmitted: false,
		isPublished: false
	};
	return null;
});

jest.mock('../../../../../src/database/repository/BlogRepo', () => ({
	get findUrlIfExists() { return mockBlogFindUrlIfExists; },
	get create() { return mockBlogCreate; },
	get update() { return mockBlogUpdate; },
	get findBlogAllDataById() { return mockFindBlogAllDataById; }
}));