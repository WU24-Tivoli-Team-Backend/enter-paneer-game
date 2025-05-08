import Game from "../components/Game";

export default function GamePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full">
        <Game />
      </div>
    </div>
  );
}
