import Game from "./components/Game";

export default function GamePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full">
        <Game />
      </div>

      <div className="mt-10">
        <a
          href="/"
          className="text-sm hover:underline hover:underline-offset-4 flex items-center gap-2"
        >
          ← Back to home
        </a>
      </div>
    </div>
  );
}
