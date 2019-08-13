import {expect} from 'chai';
import {
	prop,
	assoc,
	lens,
	view,
	set,
	over,
	setOver,
	setOverAsync,
	lensProp,
	lensPath,
	overAsync
} from '../src/lenses';
import {compose} from '../src/compose';
import {Ilens} from '../src/interfaces';

interface Address {
	street: string;
}

interface Company {
	id: number;
	name: string;
	address: Address
}

interface Comment {
	id: number;
	text: string;
	to: {
		id: number;
	}
}

interface Data {
	id: number;
	name: string;
	company: Company;
	comments: Comment[];
}

describe('tests for lenses', () => {
	it('prop', () => {
		const data = {
			id: 1,
			name: 'foo'
		};
		const a = prop('id');
		const b = prop('name');
		expect(a(data)).to.eql(1);
		expect(a(undefined)).to.be.undefined;
		expect(b(data)).to.eql('foo');
	});
	it('assoc', () => {

		const data = {
			id: 1,
			name: 'foo'
		};
		const a = assoc('id')(3);
		const b = assoc('name', 'vasja');
		expect(a(data)).to.eql({
			id: 3,
			name: 'foo'
		});
		expect(a(undefined)).to.eql({
			id: 3
		});

		expect(b(data)).to.eql({
			id: 1,
			name: 'vasja'
		});
		const c = assoc(1, 'petja');

		expect(c([1, 2, 3])).to.be.eql([1, 'petja', 3]);

	});
	it('lens, view, set', () => {
		interface Idata {
			id: number,
			name: string
		}

		const data = {
			id: 1,
			name: 'foo'
		};

		const a: Ilens<Idata, number> = lens(prop('id'), assoc('id'));
		const u = view<Idata, number>(a)(data);
		expect(u).to.be.eql(1);

		const b: Ilens<Idata, string> = lens(prop('name'), assoc('name'));
		expect(view(b, data)).to.be.eql('foo');

		expect(set<Idata, number>(a)(3)(data)).to.be.eql({
			id: 3,
			name: 'foo'
		});
		expect(set(b, 'vasja', data)).to.be.eql({
			id: 1,
			name: 'vasja'
		});

	});
	it('lensProp', () => {
		const data = {
			id: 1,
			name: 'foo'
		};
		const a = lensProp('id');
		const b = lensProp('name');
		expect(view(a)(data)).to.be.eql(1);
		expect(view(b, data)).to.be.eql('foo');

		expect(set(a)(3)(data)).to.be.eql({
			id: 3,
			name: 'foo'
		});
		expect(set(b, 'vasja', data)).to.be.eql({
			id: 1,
			name: 'vasja'
		});
	});
	it('over', () => {
		interface Idata {
			id: number,
			name: string
		}

		const data = {
			id: 1,
			name: 'foo'
		};
		const a: Ilens<Idata, number> = lensProp('id');
		const b: Ilens<Idata, string> = lensProp('name');

		expect(over<Idata, number>(a)((_) => _ + 2)(data)).to.be.eql({
			id: 3,
			name: 'foo'
		});
		expect(over<Idata, string>(b, (_) => _ + '_vasja', data)).to.be.eql({
			id: 1,
			name: 'foo_vasja'
		});
	});
	it('overAsync', async () => {
		const data = {
			id: 1,
			name: 'foo'
		};
		const a = lensProp('id');
		const b = lensProp('name');

		expect(await overAsync(a)(async (a) => a + 2)(data)).to.be.eql({
			id: 3,
			name: 'foo'
		});
		expect(await overAsync(b, async (_) => _ + '_vasja', data)).to.be.eql({
			id: 1,
			name: 'foo_vasja'
		});
	});
	it('setOver', () => {
		const data = {
			id: 1,
			name: 'foo'
		};
		const a = lensProp('id');
		const b = lensProp('name');

		expect(setOver(a, b)((a) => a + 2)(data)).to.be.eql({
			id: 'foo2',
			name: 'foo'
		});
		expect(setOver(b, a, (_) => _ + '_vasja', data)).to.be.eql({
			id: 1,
			name: '1_vasja'
		});
	});
	it('setOverAsync', async () => {
		const data = {
			id: 1,
			name: 'foo'
		};
		const a = lensProp('id');
		const b = lensProp('name');

		expect(await setOverAsync(a, b)(async (a) => a + 2)(data)).to.be.eql({
			id: 'foo2',
			name: 'foo'
		});
		expect(await setOverAsync(b, a, async (_) => _ + '_vasja', data)).to.be.eql({
			id: 1,
			name: '1_vasja'
		});
	});

	it('lensPath', () => {


		const data = {
			id: 1,
			name: 'foo',
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'randomstreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'not sure.', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		};

		const a = lensPath<Data, 'id'>('id');

		const c = lensPath<Data, 'company', 'address', 'street'>('company', 'address', 'street');
		const b = lensPath<Data, 'comments', 1, 'text'>('comments', 1, 'text');
		// @ts-ignore
		const d = lensPath('a', 'b', 'c');
		expect(view<Object, number>(a)(data)).to.eql(1);
		expect(view(b, data)).to.eql('not sure.');
		expect(view(c, data)).to.eql('randomstreet');
		expect(view(d, data)).to.be.undefined;
		expect(set(d, 'vasjaC', data)).to.eql({
			id: 1,
			name: 'foo',
			a: {b: {c: 'vasjaC'}},
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'randomstreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'not sure.', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		});

		expect(set(c, 'vasjaStreet', data)).to.eql({
			id: 1,
			name: 'foo',
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'vasjaStreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'not sure.', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		});

		expect(set(b, 'sure Vasja', data)).to.eql({
			id: 1,
			name: 'foo',
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'randomstreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'sure Vasja', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		});

		expect(set(a, 75, data)).to.eql({
			id: 75,
			name: 'foo',
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'randomstreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'not sure.', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		});

		expect(over(c, (v) => v + '_vasjaStreet', data)).to.eql({
			id: 1,
			name: 'foo',
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'randomstreet_vasjaStreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'not sure.', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		});

		expect(over(b, (v) => v + '_sure Vasja', data)).to.eql({
			id: 1,
			name: 'foo',
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'randomstreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'not sure._sure Vasja', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		});

		expect(over(a, (v) => v + 2, data)).to.eql({
			id: 3,
			name: 'foo',
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'randomstreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'not sure.', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		});

	});

	it('compose', () => {
		const data = {
			id: 1,
			name: 'foo',
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'randomstreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'not sure.', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		};
		const a = lensPath<Data, 'id'>('id');
		const b = lensPath<Data, 'comments', 1, 'text'>('comments', 1, 'text');
		const c = lensPath<Data, 'company', 'address', 'street'>('company', 'address', 'street');

		expect(view(a)(data)).to.eql(1);
		expect(view(b, data)).to.eql('not sure.');
		expect(view(c, data)).to.eql('randomstreet');
		expect(compose(set(c, 'vasjaStreet'), set(b, 'sure Vasja'), over(a, (v) => v + 2))(data)).to.eql({
			id: 3,
			name: 'foo',
			company: {
				id: 12,
				name: 'bar',
				address: {
					street: 'vasjaStreet',
				}
			},
			comments: [
				{id: 2, text: 'yes, this could work.', to: {id: 4}},
				{id: 3, text: 'sure Vasja', to: {id: 12}},
				{id: 4, text: 'well, maybe', to: {id: 4}},
			],
		});
	});

});
