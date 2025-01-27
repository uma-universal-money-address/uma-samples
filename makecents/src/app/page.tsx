import dynamic from "next/dynamic";

const CentsExperience = dynamic(
  () => import("./CentsExperience"),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <>
      <CentsExperience />
    </>
  );
}
