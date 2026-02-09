import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  Edit,
  Check,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuestionBuilder({ questions, onChange, totalPoints }) {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1
    };
    onChange([...questions, newQuestion]);
    setExpandedQuestion(questions.length);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    onChange(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    const options = [...updatedQuestions[questionIndex].options];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options };
    onChange(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    const options = [...updatedQuestions[questionIndex].options, ''];
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options };
    onChange(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    const options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options };
    onChange(updatedQuestions);
  };

  const deleteQuestion = (index) => {
    if (confirm('Are you sure you want to delete this question?')) {
      onChange(questions.filter((_, i) => i !== index));
      if (expandedQuestion === index) {
        setExpandedQuestion(null);
      }
    }
  };

  const moveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const updatedQuestions = [...questions];
    [updatedQuestions[index], updatedQuestions[newIndex]] = [updatedQuestions[newIndex], updatedQuestions[index]];
    onChange(updatedQuestions);
    setExpandedQuestion(newIndex);
  };

  const currentTotal = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div>
          <h3 className="font-semibold text-gray-900">Questions ({questions.length})</h3>
          <p className="text-sm text-gray-600">
            Total Points: <span className={`font-semibold ${currentTotal !== totalPoints ? 'text-orange-600' : 'text-green-600'}`}>
              {currentTotal} / {totalPoints}
            </span>
          </p>
        </div>
        <Button onClick={addQuestion} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {currentTotal !== totalPoints && questions.length > 0 && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
          <X className="w-4 h-4 text-orange-600" />
          <p className="text-sm text-orange-800">
            Warning: Question points ({currentTotal}) don't match total points ({totalPoints})
          </p>
        </div>
      )}

      {questions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-4">Add your first question to get started</p>
            <Button onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <Card key={index} className="overflow-hidden">
              <div 
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Question {index + 1}</span>
                        <Badge variant="outline" className="text-xs">
                          {question.type === 'multiple_choice' ? 'Multiple Choice' : 
                           question.type === 'true_false' ? 'True/False' : 'Essay'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {question.points} {question.points === 1 ? 'point' : 'points'}
                        </Badge>
                      </div>
                      {question.question && (
                        <p className="text-sm text-gray-600 truncate">{question.question}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveQuestion(index, 'up');
                      }}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveQuestion(index, 'down');
                      }}
                      disabled={index === questions.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(index);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {expandedQuestion === index && (
                <CardContent className="p-6 border-t space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Question Type</label>
                      <Select
                        value={question.type}
                        onValueChange={(value) => {
                          updateQuestion(index, 'type', value);
                          if (value === 'true_false') {
                            updateQuestion(index, 'options', ['True', 'False']);
                          } else if (value === 'essay') {
                            updateQuestion(index, 'options', []);
                            updateQuestion(index, 'correct_answer', '');
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                          <SelectItem value="essay">Essay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Points</label>
                      <Input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question Text</label>
                    <Textarea
                      placeholder="Enter your question here..."
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {question.type === 'multiple_choice' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Answer Options</label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addOption(index)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          />
                          <Button
                            size="sm"
                            variant={question.correct_answer === option && option ? 'default' : 'outline'}
                            onClick={() => updateQuestion(index, 'correct_answer', option)}
                            disabled={!option}
                          >
                            {question.correct_answer === option && option ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              'Set Correct'
                            )}
                          </Button>
                          {question.options.length > 2 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => removeOption(index, optionIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {question.correct_answer && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Correct answer: {question.correct_answer}
                        </p>
                      )}
                    </div>
                  )}

                  {question.type === 'true_false' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correct Answer</label>
                      <Select
                        value={question.correct_answer}
                        onValueChange={(value) => updateQuestion(index, 'correct_answer', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="True">True</SelectItem>
                          <SelectItem value="False">False</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {question.type === 'essay' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Essay Question:</strong> This will require manual grading. Students will type their answer in a text field.
                      </p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}