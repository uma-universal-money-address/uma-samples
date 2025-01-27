import { useState } from "react";
import { RefreshIcon, StarIcon, StarOutlineIcon } from "@/components/Icons";
import { useReducer } from "react";

const pages: {
  title: string;
  buttonText: string;
  inputType?: "stars" | "numbers" | "yesNoMaybe";
}[] = [
  {
    title: "Rate this overall ad experience?",
    inputType: "stars",
    buttonText: "Next",
  },
  {
    title: "Did you find the ad's content engaging?",
    inputType: "numbers",
    buttonText: "Next",
  },
  {
    title: "Would you like to learn more about this product?",
    inputType: "yesNoMaybe",
    buttonText: "Next",
  },
  {
    title: "Thank you for your feedback!",
    buttonText: "Watch again",
  },
];

const QuestionnaireContent = ({
  onWatchAgain,
}: {
  onWatchAgain: () => void;
}) => {
  const [page, setPage] = useState(0);
  const [progress, setProgress] = useState(0);

  const initialState = pages.reduce(
    (acc: { [index: number]: number | null }, _, index) => {
      acc[index] = null;
      return acc;
    },
    {},
  );

  const reducer = (
    state: { [index: number]: number | null },
    action: { type: "SET_RESPONSE"; page: number; response: number },
  ) => {
    switch (action.type) {
      case "SET_RESPONSE":
        return { ...state, [action.page]: action.response };
      default:
        return state;
    }
  };

  const [responses, dispatch] = useReducer(reducer, initialState);

  const handleNext = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
      setProgress(((page + 1) / (pages.length - 1)) * 100);
    } else if (page === pages.length - 1 && onWatchAgain) {
      onWatchAgain();
    }
  };

  const renderInput = (
    pageIndex: number,
    inputType?: "numbers" | "stars" | "yesNoMaybe",
  ) => {
    const handleButtonClick = (response: number) => {
      dispatch({ type: "SET_RESPONSE", page: pageIndex, response });
    };

    switch (inputType) {
      case "stars":
        return (
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleButtonClick(star)}
                className={`px-2 py-2`}
              >
                {responses[pageIndex] && responses[pageIndex] >= star ? (
                  <StarIcon className="mr-[16px] h-[24px] w-[24px]" />
                ) : (
                  <StarOutlineIcon className="mr-[16px] h-[24px] w-[24px]" />
                )}
              </button>
            ))}
          </div>
        );
      case "numbers":
        return (
          <div>
            {[1, 2, 3, 4, 5].map((number) => (
              <button
                key={number}
                onClick={() => handleButtonClick(number)}
                className={`mr-[16px] rounded-full border-[1px] px-[16px] py-[8px] ${
                  responses[pageIndex] === number
                    ? "border-transparent bg-white text-black"
                    : "bborder-white bg-transparent text-white"
                }`}
              >
                {number}
              </button>
            ))}
            <div className="mt-[12px] flex flex-row justify-between text-[10px] text-white">
              <div>Strongly disagree</div>
              <div>Strongly agree</div>
            </div>
          </div>
        );
      case "yesNoMaybe":
        return (
          <div>
            {["Yes", "No", "Maybe"].map((option, index) => (
              <button
                key={option}
                onClick={() => handleButtonClick(index)}
                className={`mr-[16px] rounded-full px-[16px] py-1 ${
                  responses[pageIndex] === index ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div className="rounded-full p-[4px]">{option}</div>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const isNextButtonDisabled = () => {
    return page < pages.length - 1 && responses[page] === null;
  };

  const earnedAmount = 0;

  return (
    <>
      {page < pages.length - 1 && (
        <>
          <div className="mb-[32px] mt-[32px] text-[16px] font-[500] text-white md:mt-0">
            Earn more for each questions you answer!
          </div>
          <div className="mb-10 w-[100%] md:bottom-[32px]">
            <div className="relative h-[4px] rounded-xl bg-[rgba(255,255,255,0.3)] backdrop-blur-[20px] backdrop-filter">
              <div
                className="relative h-[4px] rounded-xl bg-blue-500 transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className={`text-grey absolute top-1/2 -translate-y-1/2 transform rounded-full border bg-white px-2 py-[1px] text-xs text-black shadow-sm`}
                style={{
                  left: `${progress}%`,
                  transform: `translate(-${progress}%, -50%)`,
                }}
              >
                ${earnedAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </>
      )}
      <div
        className={`mb-[32px] text-[20px] font-[500] leading-[30px] text-white md:mb-[16px] ${page === pages.length - 1 ? "text-center" : "text-left"}`}
      >
        {pages[page].title}
      </div>
      {page < pages.length - 1 ? (
        <div className="mb-[32px]">
          {renderInput(page, pages[page].inputType)}
        </div>
      ) : (
        <div className="mb-[24px] text-center text-white">
          You are helping us make advertising experiences less miserable!
        </div>
      )}
      {page < pages.length - 1 && (
        <textarea
          className="mb-[24px] h-[200px] w-full resize-none rounded-md border-[0.5px] border-[rgba(255,255,255,0.3)] bg-transparent px-[12px] py-[24px] text-white md:h-[96px]"
          placeholder="Tell us why (optional)"
        ></textarea>
      )}
      <div
        className={`flex flex-row ${page === pages.length - 1 ? "justify-center" : "justify-end"}`}
      >
        <div
          className={`inline-flex cursor-pointer flex-row items-center justify-center gap-[4px] rounded-full px-[24px] py-[4px] text-white ${
            isNextButtonDisabled()
              ? "cursor-not-allowed bg-gray-500"
              : "bg-brand"
          }`}
          onClick={!isNextButtonDisabled() ? handleNext : undefined}
        >
          {pages[page].buttonText}
          {page === pages.length - 1 && (
            <RefreshIcon className="h-[16px] w-[16px]" />
          )}
        </div>
      </div>
    </>
  );
};

export const BottomQuestionnaire = ({
  onWatchAgain,
  isVideoCompleted,
}: {
  onWatchAgain: () => void;
  isVideoCompleted: boolean;
}) => {
  if (!isVideoCompleted) return null;
  return (
    <div className="fixed bottom-0 z-10 flex h-[70%] w-full flex-col rounded-t-[32px] border-[0.5px] border-b-0 border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.3)] p-[25px] backdrop-blur-[20px] backdrop-filter md:hidden">
      <QuestionnaireContent onWatchAgain={onWatchAgain} />
    </div>
  );
};

export const InsetQuestionnaire = ({
  onWatchAgain,
  isVideoCompleted,
}: {
  onWatchAgain: () => void;
  isVideoCompleted: boolean;
}) => {
  if (!isVideoCompleted) return null;
  return (
    <div className="absolute inset-0 z-20 items-center justify-center hidden md:flex">
      <div className="w-[420px] flex-col items-center justify-center rounded-[8px] bg-[rgba(0,0,0,0.5)] p-[25px] backdrop-blur-[20px] backdrop-filter">
        <QuestionnaireContent onWatchAgain={onWatchAgain} />
      </div>
    </div>
  );
};
