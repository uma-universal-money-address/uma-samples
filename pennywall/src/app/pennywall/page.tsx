import dynamic from "next/dynamic";

const PaperExperience = dynamic(
  () => import("./PaperExperience"),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <>
      <PaperExperience />
    </>
  );
}
