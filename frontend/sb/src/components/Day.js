import React from 'react';
import "../css/Day.css";
import Lecture from './Lecture';

export default function Day(props) {
    function timeToMinutes(hour, minute, period) {
        const hh = (period === "PM" && hour !== 12) ? hour + 12 : (period === "AM" && hour === 12) ? 0 : hour;
        return hh * 60 + minute; 
    }

    function sortByDay(day) {
        const class1 = props.data.filter(item => item.day === day);

        return class1.sort((a, b) => {
            const aStartTime = timeToMinutes(a.fh, a.fm, a.fs);
            const bStartTime = timeToMinutes(b.fh, b.fm, b.fs);

            return aStartTime - bStartTime;
        });
    }

    const sortedClasses = sortByDay(props.day);

    return (
        <div className='MainDay'>
            <h2>{props.day}</h2>
            <div className='classes'>
                {sortedClasses.map((item, index) => {
                    return (
                        <Lecture 
                            key={`${item.sub}-${index}`}
                            diff={item.diff} 
                            sub={item.sub} 
                            day={props.day}
                            fm={item.fm}
                            fh={item.fh}
                            fs={item.fs}
                            time={`${item.fh.toString().padStart(2, '0')}:${item.fm.toString().padStart(2, '0')} ${item.fs} - ${item.th.toString().padStart(2, '0')}:${item.tm.toString().padStart(2, '0')} ${item.ts}`} 
                            dur={item.dur[0] > 0 ? `${item.dur[0]} hour(s) ${item.dur[1]} minutes` : `${item.dur[1]} minutes`} 
                            faculty={item.fac} 
                        />
                    );
                })}
            </div>
        </div>
    );
}
