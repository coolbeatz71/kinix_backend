import app from './app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`[server] 🚀✨ Application listening to ${port}`);
});
