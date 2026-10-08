declare module "virtual:content" {
  import type { Lesson, WorldContent } from "./types";
  const content: { lessons: Lesson[]; worlds: WorldContent[] };
  export default content;
}
