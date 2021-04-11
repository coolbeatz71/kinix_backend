import app from './app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Example app listening ${port}`);
});
