import AppLayout from "../layouts/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold">BookLoop Home</h1>
      <p>Explore books here...</p>

      <div className="text-9xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis dolorem
        cupiditate consequatur praesentium repellendus eligendi illum dolore
        molestiae, magni distinctio maxime autem sunt corporis, minima, voluptas
        consectetur voluptates doloribus! Labore!
      </div>
    </AppLayout>
  );
}