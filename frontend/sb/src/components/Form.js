import React from 'react'
import "../css/Form.css";
export default function Form() {
  return (
        <div class="form-container">
        <h2>Assignment</h2>
        <form>
            <div class="form-group">
                <input type="text" id="text1" name="Subject" placeholder='Subject'/>
            </div>

            <div class="form-group">
                
                <input type="text" id="text2" name="faculty" placeholder='Faculty'/>
            </div>

            <div class="form-group">
                <label for="date">Submission Date:</label>
                <input type="date" id="date" name="date"/>
            </div>

            <div class="form-group">
                <label for="time">End Time:</label>
                <input type="time" id="time" name="time"/>
            </div>

            <div class="form-group">
                <select id="select" name="select">
                    <option value="" selected disabled>Importance</option>
                    <option value="Negligible">Negligible</option>
                    <option value="Considerable">Considerable</option>
                    <option value="Game Changing">Game Changing</option>
                </select>
            </div>

            <div class="form-group">
                <textarea id="textarea" name="textarea" rows="4" placeholder='Note'></textarea>
            </div>

            <div class="form-group">
                
                <input type="number" id="number" name="number" placeholder='Time to Complete(hrs)'/>
            </div>
            <button type="submit" class="submit-btn">Add Assignment</button>
        </form>
        </div>
  )
}
