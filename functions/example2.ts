export const onRequest: PagesFunction = async (context) => {
	const value = 'ok';
 	return new Response(value);
}