/**
 * Internal dependencies
 */
// eslint-disable-next-line @wordpress/dependency-group
import { _setStorageKeyPrefix, _setSelectedStorageBackend, get, set, deleteItem, getKeys } from './cache';

describe( 'googlesitekit.api.cache', () => {
	[ 'localStorage', 'sessionStorage' ].forEach( ( backend ) => {
		describe( `${ backend } backend`, () => {
			let storageMechanism;
			beforeAll( () => {
				storageMechanism = global[ backend ];
				_setSelectedStorageBackend( storageMechanism );
			} );

			afterAll( () => {
				// Reset the backend storage mechanism.
				_setSelectedStorageBackend( undefined );
			} );

			describe( 'get', () => {
				it( 'should return undefined when the key is not found', async () => {
					const result = await get( 'not-a-key' );

					expect( storageMechanism.getItem ).toHaveBeenCalledWith( 'not-a-key' );
					expect( result.cacheHit ).toEqual( false );
					expect( result.value ).toEqual( undefined );
				} );

				it( 'should return undefined when the key is found but the TTL is too high', async () => {
					const didSave = await set( 'old-key', 'something', 1 );
					expect( didSave ).toEqual( true );

					const result = await get( 'old-key', 5 );

					expect( storageMechanism.getItem ).toHaveBeenCalledWith( 'old-key' );
					expect( result.cacheHit ).toEqual( false );
					expect( result.value ).toEqual( undefined );
				} );

				it( 'should return the value when the key is found and the data is not stale', async () => {
					const didSave = await set( 'modern-key', 'something' );
					expect( didSave ).toEqual( true );

					const result = await get( 'modern-key', 100 );

					expect( storageMechanism.getItem ).toHaveBeenCalledWith( 'modern-key' );
					expect( result.cacheHit ).toEqual( true );
					expect( result.value ).toEqual( 'something' );
				} );

				it( 'should return an undefined saved value but set cacheHit to true', async () => {
					const didSave = await set( 'undefined', undefined );
					expect( didSave ).toEqual( true );

					const result = await get( 'undefined' );

					expect( storageMechanism.getItem ).toHaveBeenCalledWith( 'undefined' );
					expect( result.cacheHit ).toEqual( true );
					expect( result.value ).toEqual( undefined );
				} );

				it( 'should return a number value', async () => {
					const didSave = await set( 'number', 500 );
					expect( didSave ).toEqual( true );

					const result = await get( 'number', 100 );

					expect( storageMechanism.getItem ).toHaveBeenCalledWith( 'number' );
					expect( result.cacheHit ).toEqual( true );
					expect( result.value ).toEqual( 500 );
				} );

				it( 'should return an array value', async () => {
					const didSave = await set( 'array', [ 1, '2', 3 ] );
					expect( didSave ).toEqual( true );

					const result = await get( 'array', 100 );

					expect( storageMechanism.getItem ).toHaveBeenCalledWith( 'array' );
					expect( result.cacheHit ).toEqual( true );
					expect( result.value ).toEqual( [ 1, '2', 3 ] );
				} );

				it( 'should return an object value', async () => {
					const didSave = await set( 'object', { foo: 'barr' } );
					expect( didSave ).toEqual( true );

					const result = await get( 'object', 100 );

					expect( storageMechanism.getItem ).toHaveBeenCalledWith( 'object' );
					expect( result.cacheHit ).toEqual( true );
					expect( result.value ).toEqual( { foo: 'barr' } );
				} );

				it( 'should return a complex value', async () => {
					const didSave = await set( 'complex', [ 1, '2', { cool: 'times', other: [ { time: { to: 'see' } } ] } ] );
					expect( didSave ).toEqual( true );

					const result = await get( 'complex', 100 );

					expect( storageMechanism.getItem ).toHaveBeenCalledWith( 'complex' );
					expect( result.cacheHit ).toEqual( true );
					expect( result.value ).toEqual( [ 1, '2', { cool: 'times', other: [ { time: { to: 'see' } } ] } ] );
				} );
			} );

			describe( 'set', () => {
				it( 'should not save when a hard-to-serialize data is set', async () => {
					const arrayBuffer = new ArrayBuffer( 8 );
					const didSave = await set( 'arrayBuffer', arrayBuffer, 500 );
					const storedData = JSON.stringify( {
						timestamp: 500,
						value: arrayBuffer,
					} );

					expect( didSave ).toEqual( false );
					expect( storageMechanism.setItem ).not.toHaveBeenCalledWith( 'arrayBuffer', storedData );
					expect( Object.keys( storageMechanism.__STORE__ ).length ).toBe( 0 );
				} );

				it( 'should save data', async () => {
					const didSave = await set( 'array', [ 1, 2, 3 ], 500 );
					const storedData = JSON.stringify( {
						timestamp: 500,
						value: [ 1, 2, 3 ],
					} );

					expect( didSave ).toEqual( true );
					expect( storageMechanism.setItem ).toHaveBeenCalledWith( 'array', storedData );
					expect( Object.keys( storageMechanism.__STORE__ ).length ).toBe( 1 );
				} );
			} );

			describe( 'deleteItem', () => {
				it( 'should delete data', async () => {
					const didSave = await set( 'array', [ 1, 2, 3 ], 500 );
					expect( didSave ).toEqual( true );

					const didDelete = await deleteItem( 'array' );
					expect( didDelete ).toEqual( true );
					expect( storageMechanism.removeItem ).toHaveBeenCalledWith( 'array' );
					expect( Object.keys( storageMechanism.__STORE__ ).length ).toBe( 0 );
				} );

				it( "should not error when trying to delete data that doesn't exist", async () => {
					const didDelete = await deleteItem( 'array' );
					expect( didDelete ).toEqual( true );
					expect( storageMechanism.removeItem ).toHaveBeenCalledWith( 'array' );
				} );
			} );

			describe( 'getKeys', () => {
				beforeEach( () => {
					// Set the storage key prefix so we can compare Site Kit and
					// non-Site Kit keys.
					_setStorageKeyPrefix( 'sitekit_' );
				} );

				afterEach( () => {
					// Restore the empty storage key prefix for the rest of the tests.
					_setStorageKeyPrefix( '' );
				} );

				it( 'should return an empty array when there are no keys', async () => {
					const keys = await getKeys();
					expect( keys ).toEqual( [] );
				} );

				it( 'should return an empty array when there are no Site Kit keys', async () => {
					// Set non-Site Kit keys to ensure we don't return them.
					storageMechanism.setItem( 'whatever', 'cool' );
					storageMechanism.setItem( 'something', 'else' );
					expect( Object.keys( storageMechanism.__STORE__ ).length ).toBe( 2 );

					const keys = await getKeys();
					expect( keys ).toEqual( [] );
				} );

				it( 'should return all Site Kit keys', async () => {
					await set( 'key1', 'data' );
					await set( 'key2', 'data' );

					const keys = await getKeys();
					expect( keys ).toEqual( [ 'key1', 'key2' ] );
				} );

				it( 'should not return non-Site Kit keys', async () => {
					// Set a non-Site Kit key to ensure we don't return it.
					storageMechanism.setItem( 'whatever', 'cool' );
					await set( 'key1', 'data' );
					await set( 'key2', 'data' );
					expect( Object.keys( storageMechanism.__STORE__ ).length ).toBe( 3 );

					const keys = await getKeys();
					expect( keys ).toEqual( [ 'key1', 'key2' ] );
				} );
			} );
		} );
	} );

	describe( 'no backend', () => {
		beforeAll( () => {
		// Set the backend storage mechanism to nothing; this will cause all
		// caching to be skipped.
			_setSelectedStorageBackend( null );
		} );

		afterAll( () => {
		// Reset the backend storage mechanism.
			_setSelectedStorageBackend( undefined );
		} );

		describe( 'get', () => {
			it( 'should return nothing when no storage is available', async () => {
				await set( 'key1', 'data' );

				const cacheData = await get( 'key1' );
				expect( cacheData ).toEqual( {
					cacheHit: false,
					value: undefined,
				} );
				expect( localStorage.getItem ).not.toHaveBeenCalled();
				expect( sessionStorage.getItem ).not.toHaveBeenCalled();
			} );
		} );

		describe( 'set', () => {
			it( 'should not save when no storage is available', async () => {
				const didSave = await set( 'key1', 'data' );
				expect( didSave ).toEqual( false );
				expect( localStorage.setItem ).not.toHaveBeenCalled();
				expect( sessionStorage.setItem ).not.toHaveBeenCalled();
			} );
		} );

		describe( 'deleteItem', () => {
			it( 'should not call delete when no storage is available', async () => {
				await set( 'key1', 'data' );

				const didDelete = await deleteItem( 'key1' );
				expect( didDelete ).toEqual( false );
				expect( localStorage.removeItem ).not.toHaveBeenCalled();
				expect( sessionStorage.removeItem ).not.toHaveBeenCalled();
			} );
		} );

		describe( 'getKeys', () => {
			it( 'should return nothing when no storage is available', async () => {
				await set( 'key1', 'data' );
				await set( 'key2', 'data' );

				const keys = await getKeys();
				expect( keys ).toEqual( [] );
				expect( localStorage.key ).not.toHaveBeenCalled();
				expect( sessionStorage.key ).not.toHaveBeenCalled();
			} );
		} );
	} );
} );
