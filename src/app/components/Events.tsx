"use client";
import React, { useState } from "react";
import Image from "next/image";
import { GoDash, GoPlus } from "react-icons/go";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { PiCalendarDots } from "react-icons/pi";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function Events() {
  const eventsData = [
    {
      year: 2024,
      months: [
        {
          name: "December",
          events: [
            {
              date: "10 December",
              title: "Green Earth Initiative",
              location: "Tokyo – Japan",
            },
            {
              date: "24 December",
              title: "Urban Forest Project. Roots for the Future",
              location: "Sydney – Australia",
            },
          ],
        },
        {
          name: "October",
          events: [
            {
              date: "10 October",
              title: "Green Earth Initiative",
              location: "Tokyo – Japan",
            },
            {
              date: "15 October",
              title: "One Million Trees Campaign",
              location: "São Paulo – Brazil",
            },
            {
              date: "18 October",
              title: "Trees for Tomorrow",
              location: "Cape Town – South Africa",
            },
            {
              date: "24 October",
              title: "Urban Forest Project. Roots for the Future",
              location: "Sydney – Australia",
            },
          ],
        },
        {
          name: "September",
          events: [
            {
              date: "10 September",
              title: "Green Earth Initiative",
              location: "Tokyo – Japan",
            },
          ],
        },
      ],
    },
  ];
  const completedEventsData = [
    {
      year: 2024,
      months: [
        {
          name: "June",
          events: [
            {
              date: "10 June",
              title: "Green Earth Initiative",
              location: "Tokyo – Japan",
            },
            {
              date: "24 June",
              title: "Urban Forest Project. Roots for the Future",
              location: "Sydney – Australia",
            },
          ],
        },
        {
          name: "July",
          events: [
            {
              date: "10 July",
              title: "Plant for the Planet Day",
              location: "New York City – United States",
            },
            {
              date: "15 July",
              title: "Tree of Life Celebration",
              location: "Berlin – Germany",
            },
            {
              date: "18 July",
              title: "Roots for the Future. Earth Day Tree Drive",
              location: "Cairo – Egypt",
            },
            {
              date: "24 July",
              title: "Green Canopy Challenge",
              location: "Paris – France",
            },
          ],
        },
        {
          name: "May",
          events: [
            {
              date: "10 May",
              title: "Green Earth Initiative",
              location: "Tokyo – Japan",
            },
          ],
        },
      ],
    },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedYears, setExpandedYears] = useState<{
    [key: number]: boolean;
  }>({});

  const [expandedCompletedMonths, setExpandedCompletedMonths] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedCompletedYears, setExpandedCompletedYears] = useState<{
    [key: number]: boolean;
  }>({});

  const handleToggleMonth = (monthIndex: number) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthIndex]: !prev[monthIndex],
    }));
  };
  const handleToggleCompletedMonth = (monthIndex: number) => {
    setExpandedCompletedMonths((prev) => ({
      ...prev,
      [monthIndex]: !prev[monthIndex],
    }));
  };

  const handleToggleYear = (yearIndex: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [yearIndex]: !prev[yearIndex],
    }));
  };
  const handleToggleCompletedYear = (yearIndex: number) => {
    setExpandedCompletedYears((prev) => ({
      ...prev,
      [yearIndex]: !prev[yearIndex],
    }));
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <div className="w-full">
        <div className="flex flex-col md:flex-row pt-8 md:pt-[30px] px-8 lg:px-[80px] pb-20 md:pb-[110px] bg-[#F2F0EB] justify-between">
          <div className="flex items-center justify-between text-[13px] font-normal tracking-[2px] w-full">
            <div>PLANT MILLION TREES</div>
            {/* mobile view */}
            <div className="md:hidden flex">
              <button onClick={toggleMenu} className="text-[22px]">
                &#9776;
              </button>
            </div>
          </div>

          <div
            className={`${
              menuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row justify-center items-center md:gap-20 mt-6 md:mt-0 w-full `}
          >
            <div className="flex flex-col  w-full md:flex-row gap-5 lg:gap-8 md:gap-[32px] uppercase text-[14px] font-semibold text-center cursor-pointer">
              <div className="leading-[17px]">track my tree</div>
              <div className="leading-[17px]">events</div>
              <div className="leading-[17px]">blog</div>
            </div>
            <div className="flex flex-row gap-7 lg:gap-[80px] justify-center items-center mt-4 md:mt-0">
              <Image
                src="/images/in-icon.png"
                width={21}
                height={21}
                alt="Picture of in icon"
                className="w-[21px] h-[21px]"
              />
              <button
                type="button"
                className="bg-[#F1B932] font-semibold leading-[19px] py-[12px] px-[40px] lg:px-[69px] rounded-[24px]"
              >
                DONATE
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full relative bottom-[60px] sm:bottom-[80px] p-2">
        <div className="flex flex-col w-full relative">
          <div className="flex justify-center">
            <Image
              src="/images/event-banner.png"
              width={355}
              height={310}
              alt="Picture of the author"
              className="sm:w-[1280px] sm:h-[350px] w-[355px] h-[310px] rounded-[40px]"
            />
          </div>
          <div className="uppercase font-bold text-[34px] sm:text-[44px] leading-[53px] text-center text-white tracking-[10px] sm:tracking-[20px] absolute top-[150px] left-1/2 transform -translate-x-1/2">
            events
          </div>
        </div>
      </div>
      {/*  Upcoming events */}
      <div className="flex flex-col w-full gap-4 sm:gap-6 p-3">
        <div className="font-bold text-[22px] sm:text-[32px] leading-[26px] sm:leading-[39px]">
          Upcoming events
        </div>
        <div className="flex flex-col w-full">
          {eventsData.map((yearData, yearIndex) => (
            <Accordion
              key={yearData.year}
              className="border-t-[1px] border-[#666666]"
              sx={{
                ".css-15v22id-MuiAccordionDetails-root": {
                  padding: 0,
                },
                ".css-llkuq-MuiAccordionDetails-root": {
                  padding: 0,
                },
                ".css-5ritna-MuiAccordionDetails-root": {
                  padding: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  expandedYears[yearIndex] ? (
                    <GoDash className="text-[20px] sm:text-[22px]text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                  ) : (
                    <GoPlus className="text-[20px] sm:text-[22px]text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                  )
                }
                onClick={() => handleToggleYear(yearIndex)}
                aria-controls={`panel-${yearIndex}-content`}
                id={`panel-${yearIndex}-header`}
              >
                <Typography className="font-bold text-[18px] sm:text-[20px] leading-[24px]">
                  {yearData.year}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  ".css-15v22id-MuiAccordionDetails-root": {
                    padding: 0,
                  },
                  ".css-llkuq-MuiAccordionDetails-root": {
                    padding: 0,
                  },
                  ".css-1pxj72g-MuiAccordionDetails-root": {
                    padding: 0,
                  },
                  ".css-1faarcj-MuiAccordionDetails-root": {
                    padding: 0,
                  },
                }}
              >
                <Typography>
                  {yearData.months.map((month, monthIndex) => (
                    <div
                      key={monthIndex}
                      className="border-t-[1px] border-[#666666]"
                    >
                      <Accordion
                        expanded={expandedMonths[monthIndex]}
                        onChange={() => handleToggleMonth(monthIndex)}
                      >
                        <AccordionSummary
                          expandIcon={
                            expandedMonths[monthIndex] ? (
                              <GoDash className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                            ) : (
                              <GoPlus className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                            )
                          }
                          aria-controls={`panel-${monthIndex}-content`}
                          id={`panel-${monthIndex}-header`}
                        >
                          <Typography className="font-bold text-[18px] leading-[21px] sm:ml-[60px]">
                            {month.name}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            sx={{
                              ".css-1pxj72g-MuiAccordionDetails-root": {
                                padding: 0,
                              },
                            }}
                          >
                            <div className="flex flex-col w-full text-[14px] sm:text-[16px] px-2 sm:px-0">
                              {month.events.map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className="flex w-full gap-2 sm:justify-between border-t-[1px] border-[#666666] py-2 items-center"
                                >
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] sm:ml-[60px]">
                                    {event.date}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-bold leading-[19px] text-center">
                                    {event.title}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                    {event.location}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] flex justify-center items-center">
                                    <Button
                                      aria-describedby={id}
                                      onClick={handleClick}
                                      className="text-black capitalize"
                                    >
                                      <div className="flex gap-1 sm:gap-2 sm:bg-[#F2F0EB] rounded-[25px] py-[8px] px-[5px] sm:px-[20px] justify-center items-center cursor-pointer">
                                        <PiCalendarDots className="text-[17px] sm:text-[18px]" />
                                        <div className="font-normal leading-[19px] hidden sm:block">
                                          Schedule
                                        </div>
                                      </div>
                                    </Button>
                                    <Popover
                                      id={id}
                                      open={open}
                                      anchorEl={anchorEl}
                                      onClose={handleClose}
                                      anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                      }}
                                      className="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;"
                                      sx={{
                                        ".css-uywun8-MuiPaper-root-MuiPopover-paper":
                                          {
                                            boxShadow: "initial",
                                          },
                                      }}
                                    >
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <div className="bg-[#EEF2EB] pb-4">
                                          <DateCalendar
                                            sx={{
                                              ".css-23p0if-MuiButtonBase-root-MuiPickersDay-root.Mui-selected":
                                                {
                                                  backgroundColor: "#3BAD49",
                                                },
                                              ".css-1wy8uaa-MuiButtonBase-root-MuiPickersDay-root.Mui-selected":
                                                {
                                                  backgroundColor: "#3BAD49",
                                                },
                                              ".css-uywun8-MuiPaper-root-MuiPopover-paper":
                                                {
                                                  backgroundColor: "#EEF2EB",
                                                },
                                              ".css-1wy8uaa-MuiButtonBase-root-MuiPickersDay-root:hover":
                                                {
                                                  backgroundColor: "#d7f1db",
                                                },
                                            }}
                                          />
                                          <button
                                            type="button"
                                            className="flex bg-[#F1B932] font-normal leading-[19px] mx-auto py-[7px] px-[20px] rounded-[25px]"
                                          >
                                            Schedule
                                          </button>
                                        </div>
                                      </LocalizationProvider>
                                    </Popover>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  ))}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>

      {/* Completed events */}
      <div className="flex flex-col w-full gap-4 sm:gap-6 p-2">
        <div className="font-bold text-[22px] sm:text-[32px] leading-[26px] sm:leading-[39px]">
          Completed events
        </div>
        <div className="flex flex-col w-full">
          {completedEventsData.map((yearData, yearIndex) => (
            <Accordion
              key={yearData.year}
              className="border-t-[1px] border-[#666666]"
              sx={{
                ".css-ugwo3b-MuiAccordionDetails-root": {
                  padding: "0",
                },
                ".css-siypus-MuiAccordionDetails-root": {
                  padding: "0",
                },
                ".css-orow76-MuiAccordionDetails-root": {
                  padding: "0",
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  expandedCompletedYears[yearIndex] ? (
                    <GoDash className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                  ) : (
                    <GoPlus className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                  )
                }
                onClick={() => handleToggleCompletedYear(yearIndex)}
                aria-controls={`panel-${yearIndex}-content`}
                id={`panel-${yearIndex}-header`}
              >
                <Typography className="font-bold text-[20px] leading-[24px]">
                  {yearData.year}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  ".css-ugwo3b-MuiAccordionDetails-root": {
                    padding: "0",
                  },
                  ".css-15v22id-MuiAccordionDetails-root": {
                    padding: "0",
                  },
                }}
              >
                <Typography>
                  {yearData.months.map((month, monthIndex) => (
                    <div
                      key={monthIndex}
                      className="border-t-[1px] border-[#666666]"
                    >
                      <Accordion
                        expanded={expandedCompletedMonths[monthIndex]}
                        onChange={() => handleToggleCompletedMonth(monthIndex)}
                      >
                        <AccordionSummary
                          expandIcon={
                            expandedCompletedMonths[monthIndex] ? (
                              <GoDash className="text-[20px] sm:text-[22px]text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                            ) : (
                              <GoPlus className="text-[20px] sm:text-[22px]text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                            )
                          }
                          aria-controls={`panel-${monthIndex}-content`}
                          id={`panel-${monthIndex}-header`}
                        >
                          <Typography className="font-bold text-[18px] leading-[21px]">
                            {month.name}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div className="flex flex-col w-full text-[14px] sm:text-[16px] px-2 sm:px-0">
                              {month.events.map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className="flex w-full gap-3 sm:justify-between border-t-[1px] border-[#666666] py-2 items-center"
                                >
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                    {event.date}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                    {event.title}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                    {event.location}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center"></div>
                                </div>
                              ))}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  ))}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}
