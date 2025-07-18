import { useAuth } from "../../hooks/useAuth";
import Subscription from "../../utils/subscription/Subscription";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router";
import useCategory from "../../hooks/useCategory";
import LoginPalate from "../LoginPalate/LoginPalate";
import PlayerPlate from "../PlayerPlate/PlayerPlate";
import { useDispatch } from "react-redux";
import {
  addDefaultChannel,
  addDefaultUrl,
} from "../../utils/redux/slices/slice";
import usePricing from "../../hooks/usePricing";
import { useSearchParams } from "react-router";
import FreeChannelHls from "../FeeChannelHls/FreeChannelHls";

const fetchSubscription = async (email) => {
  const res = await axios.get(
    `${import.meta.env.VITE_FLOW_MRDIA_API}/api/user/role/${email}`
  );
  return res?.data?.userData?.subscribe;
};

const fetchTrialStatus = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_FLOW_MRDIA_API}/api/free-trial/check`
  );
  return res.data;
};

const startTrialRequest = async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_FLOW_MRDIA_API}/api/free-trial/start`
  );
  return res.data;
};

const MainContent = () => {
  const dispatch = useDispatch();
  const [categorys] = useCategory();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [trialActive, setTrialActive] = useState(false);
  const [trialTimeLeft, setTrialTimeLeft] = useState(60);
  const [pricing] = usePricing();
  const [pid, setPid] = useState(null);
  const [worker, setWorker] = useState(null);
  const channelDataFilter = categorys?.filter(
    (item) => item?.category === "Channel"
  );
  const categoryId = searchParams.get("id");


  useEffect(() => {
    const pid = searchParams.get("pid");
    const sub6 = searchParams.get("sub6");
    if (pid) {
      localStorage.setItem("pid", pid);
      localStorage.setItem("worker", sub6);
    }
  }, [searchParams]);

  useEffect(() => {
    const storedPid = localStorage.getItem("pid");
    const storedWorker = localStorage.getItem("worker");
    if (storedPid && storedWorker) {
      setPid(storedPid);
      setWorker(storedWorker);
    }
  }, [pid, worker]);
  const filterChannel = channelDataFilter.find(
    (item) => item?._id === categoryId
  );
  
  const freeChannel = filterChannel?.type === "free" ? filterChannel : null;
  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ["subscription-status", user?.email],
    queryFn: () => fetchSubscription(user.email),
    enabled: !!user?.email,
    refetchInterval: 500,
  });

  const { data: trialData, isLoading: trialLoading } = useQuery({
    queryKey: ["free-trial-status"],
    queryFn: fetchTrialStatus,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
  });

  const { mutate: startTrial } = useMutation({
    mutationFn: startTrialRequest,
    onSuccess: () => {
      setTrialActive(true);
      const interval = setInterval(() => {
        setTrialTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setTrialActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
  });
  useEffect(() => {
    if (channelDataFilter.length > 0 && channelDataFilter[0]?.channelURL) {
      dispatch(addDefaultUrl(channelDataFilter[0].channelURL));
      dispatch(addDefaultChannel(channelDataFilter[0]));
    }
  }, [channelDataFilter, dispatch]);

  return (
    <Subscription
      className={`w-full lg:h-[600px]  ${
        !subscription && "bg-[var(--secondary)] rounded-lg"
      }`}
    >
      <section className="h-full w-full">
        {!user ? (
          trialActive ? (
            <PlayerPlate
              user={user}
              trialActive={trialActive}
              trialTimeLeft={trialTimeLeft}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-4 py-12 lg:p-4 ">
              <div
                className={`${
                  trialData?.used === false &&
                  "rounded-xl p-4 md:p-6 text-center bg-[var(--background)] max-w-md md:min-w-md  shadow-md shadow-[#dd8f3c]"
                } `}
              >
                {trialData?.used === false && (
                  <>
                    <h2 className="text-base md:text-xl font-bold mb-2 md:mb-4">
                      Start Watching Now
                    </h2>
                    <p className="text-xs md:text-base mb-4 md:mb-6">
                      Try our free trial to access all content
                    </p>
                  </>
                )}

                {trialData?.used === false && !trialActive && (
                  <button
                    onClick={() => startTrial()}
                    className="bg-[var(--primary)] flex gap-2 items-center justify-center text-white text-xs md:text-base  px-4 py-2 lg:py-3 w-full rounded-sm md:rounded-md font-medium hover:bg-opacity-90  cursor-pointer transition"
                  >
                    <FaPlay className="text-base md:text-xl" />
                    Watch Now
                  </button>
                )}

                {trialData?.used === true && <LoginPalate />}

                {trialLoading && (
                  <div className="text-center py-4">
                    <p>Checking trial availability...</p>
                  </div>
                )}
              </div>
            </div>
          )
        ) : subscription === "active" ? (
          <PlayerPlate />
        ) : (subscription === "expired" || subscription === false) &&
          !subLoading &&
          !trialActive ? (
          !freeChannel && !subscription ? (
            pricing.length !== 0 ? (
              <div className="flex items-center justify-center h-full w-full">
                <div className="bg-[var(--background)] rounded-xl p-4">
                  <h1 className="text-2xl font-semibold mb-2">Select a plan</h1>
                  <p className="text-sm">
                    Watch Unlimited BOXING, MMA (PPV INCLUDED), NFL, NCAAF,
                    NCAAB, Rodeo, MLB, NHL, NBA — No Blackouts. Instant
                    activation!
                  </p>
                  <div className="flex flex-col gap-6 mt-6">
                    {pricing?.map((price) => (
                      <Link
                        key={price?._id}
                        to={`https://go.adsflowmedia.com/go.php?oid=401&${
                          pid && `pid=${pid}`
                        }&sub3=${user?.email}&sub6=${worker}`}
                      >
                        <div className="group hover:bg-[var(--primary)] px-4 py-3 border border-[var(--primary)] rounded-lg flex items-center justify-between relative transition-colors duration-300 ease-linear">
                          <div>
                            <div className="flex items-center gap-6">
                              <h2 className="text-xl font-semibold group-hover:text-[var(--background)]">
                                {price?.passName}
                              </h2>
                              <p className="text-sm group-hover:text-[var(--secondary)]">
                                {price?.days} Days
                              </p>
                            </div>
                            <p className="mt-2 text-sm group-hover:text-[var(--secondary)]">
                              {price?.device} Device
                            </p>
                          </div>
                          <div>
                            {price?.value && (
                              <p className="uppercase text-center absolute -top-3 bg-[var(--primary)] text-xs p-1 rounded-sm group-hover:text-[var(--background)] group-hover:bg-[var(--text)]">
                                {price.value}
                              </p>
                            )}
                            <div className="flex items-end flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                {price.regularPrice && (
                                  <p className="line-through text-sm text-gray-400 group-hover:text-[var(--secondary)]">
                                    ${price?.regularPrice}
                                  </p>
                                )}
                                <p className="font-semibold text-lg group-hover:text-[var(--background)]">
                                  ${price?.offerPrice}
                                </p>
                              </div>
                              {price.discount && (
                                <p className="bg-[var(--primary)] text-sm px-2 rounded-sm group-hover:text-[var(--background)] group-hover:bg-[var(--text)]">
                                  {price?.discount}% Offer
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <p className="mt-4 text-sm">
                    Our subscriptions do not auto-renew. You will need to renew
                    manually if you wish to continue.
                  </p>
                </div>
              </div>
            ) : null
          ) : (
            <FreeChannelHls
              src={freeChannel?.channelURL}
              channelName={freeChannel?.channelName}
            />
          )
        ) : (
          <div className="flex items-center justify-center w-full h-full py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-lg font-medium mb-2 text-white"> WELCOME TO</p>
              <img src="/logo.png" className="w-[150px] h-auto" />
            </div>
          </div>
        )}
      </section>
    </Subscription>
  );
};

export default MainContent;
