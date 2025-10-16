import { initServer } from "./app.js";

const PORT = process.env.PORT || 3000;
initServer().then(app => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
