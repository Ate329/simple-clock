import PomodoroWidget from './PomodoroWidget';

const PomodoroPage = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <PomodoroWidget isOpen={true} />
        </div>
    );
};

export default PomodoroPage;
